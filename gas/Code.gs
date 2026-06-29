/**
 * ============================================================================
 * School Score System v2.6 — Google Apps Script Backend
 * File: Code.gs
 *
 * SUBJECT ID SCHEME: Column indices (5=E, 6=F, … 25=Y) used consistently
 * throughout GAS and frontend. This matches localStorage score keys.
 *
 * SHEET ARCHITECTURE
 * ──────────────────
 * Scores    : READ/WRITE  — A=No, B=StudentID, C=Name, D=Gender, E3:Y38=Scores,
 *                           Z3:AC38=Results(READ ONLY), AD2=ActiveCount
 * Students  : READ ONLY   — A=No, B=StudentID, C=Name, D=Gender
 *             (If not found, falls back to Scores sheet rows 3–38, cols A–D)
 * Subjects  : READ/WRITE  — A=SubjectID(col index 5–25), B=Name, C=Active
 *             (If not found, auto-created from Scores row 2 header E2:Y2)
 * Audit_Log : WRITE ONLY  — Timestamp, TelegramUser, StudentID, StudentName,
 *                           Subject, OldScore, NewScore
 * ============================================================================
 */

// ─── Sheet Helpers ────────────────────────────────────────────────────────────

/** Returns the "Scores" sheet, or falls back to the first sheet in the workbook. */
function getScoresSheet(ss) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName("Scores") || ss.getSheets()[0];
}

/**
 * Returns the "Subjects" sheet.
 * AUTO-CREATES it from the Scores sheet header row (E2:Y2) if it doesn't exist.
 * Subject IDs are column indices (5=E, 6=F, …, 25=Y).
 */
function getOrCreateSubjectsSheet(ss) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Subjects");
  if (sheet) return sheet;

  // Create and populate from Scores row 2 header (E2:Y2)
  var scoresSheet = getScoresSheet(ss);
  sheet = ss.insertSheet("Subjects");

  // Header row
  sheet.appendRow(["SubjectID", "Name", "Active"]);
  sheet.getRange("A1:C1").setFontWeight("bold").setBackground("#e2e8f0");

  var headers = scoresSheet.getRange(2, 5, 1, 21).getValues()[0]; // E2:Y2 → 21 values
  for (var i = 0; i < headers.length; i++) {
    var name = headers[i];
    if (name && String(name).trim() !== "") {
      var colId = 5 + i; // column index: 5=E, …, 25=Y
      sheet.appendRow([colId, String(name).trim(), true]);
    }
  }

  return sheet;
}

/** Returns Audit_Log sheet, auto-creates with header if missing. */
function getOrCreateAuditSheet(ss) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Audit_Log");
  if (!sheet) {
    sheet = ss.insertSheet("Audit_Log");
    sheet.appendRow([
      "Timestamp", "TelegramUser", "StudentID",
      "StudentName", "Subject", "OldScore", "NewScore"
    ]);
    sheet.getRange("A1:G1").setFontWeight("bold").setBackground("#e2e8f0");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonOut(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorOut(msg) {
  return jsonOut({ result: "error", message: msg });
}

// ─── GET Handler ──────────────────────────────────────────────────────────────

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e.parameter && e.parameter.action) ? e.parameter.action : "ping";

    // ── PING ──────────────────────────────────────────────────────────────────
    if (action === "ping") {
      return jsonOut({ result: "success", message: "API is online" });
    }

    // ── GET SUBJECTS ──────────────────────────────────────────────────────────
    // Subject ID = column index (5–25). Auto-creates Subjects sheet if needed.
    if (action === "getSubjects") {
      var subSheet = getOrCreateSubjectsSheet(ss);
      var lastRow = subSheet.getLastRow();
      if (lastRow < 2) return jsonOut([]); // No data rows

      var data = subSheet.getRange(2, 1, lastRow - 1, 3).getValues();
      var subjects = [];

      data.forEach(function(row) {
        var id     = parseInt(row[0]); // Col A — column index 5–25
        var name   = String(row[1]);   // Col B — subject name
        var active = row[2];           // Col C — TRUE/FALSE

        if (!isNaN(id) && name.trim() !== "") {
          subjects.push({
            id:     id,
            name:   name.trim(),
            active: (active === true || String(active).toUpperCase() === "TRUE")
          });
        }
      });

      return jsonOut(subjects);
    }

    // ── GET STUDENTS ──────────────────────────────────────────────────────────
    // Reads student list from "Students" sheet, or falls back to Scores rows 3-38 (cols A-D).
    // Reads scores from Scores!E3:Y38 — keyed by column index (5–25).
    // Reads results from Scores!Z3:AC38 — Total, Average, Rank, Grade (READ ONLY).
    if (action === "getStudents") {
      var scoresSheet = getScoresSheet(ss);

      // ── Student list, Score grid (E3:Y38) and Result grid (Z3:AC38) ──
      // Read directly from Scores sheet to ensure 100% row alignment across student details, scores, and results.
      var studentRows = scoresSheet.getRange("A3:D38").getValues(); // [36][4]
      var scoreGrid   = scoresSheet.getRange("E3:Y38").getValues(); // [36][21]
      var resultGrid  = scoresSheet.getRange("Z3:AC38").getValues(); // [36][4]

      var students  = [];
      var scoresMap = {};

      studentRows.forEach(function(row, i) {
        var rawNo  = row[0];
        var id     = String(row[1]).trim();
        var name   = String(row[2]).trim();
        var gender = String(row[3]).trim();

        if (!id || id === "" || id === "undefined") return;

        var seqNo    = (!isNaN(parseInt(rawNo)) && parseInt(rawNo) > 0) ? parseInt(rawNo) : (i + 1);
        var resRow   = resultGrid[i] || [];
        var scoreRow = scoreGrid[i]  || [];

        students.push({
          no:      seqNo,
          id:      id,
          name:    name,
          gender:  gender,
          total:   resRow[0] || 0,   // Col Z
          average: resRow[1] || 0,   // Col AA
          rank:    resRow[2] || "",  // Col AB
          grade:   resRow[3] || ""   // Col AC
        });

        // Scores keyed by column index (5=E, 6=F, …, 25=Y)
        scoresMap[id] = {};
        for (var s = 0; s < 21; s++) {
          var val = scoreRow[s];
          if (val !== "" && val !== null && val !== undefined) {
            var colIdx = 5 + s; // column index 5–25
            scoresMap[id][colIdx] = val;
          }
        }
      });

      return jsonOut({ students: students, scores: scoresMap });
    }

    return errorOut("Unknown action: " + action);

  } catch (err) {
    return errorOut("doGet exception: " + err.toString());
  }
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var requestData = JSON.parse(e.postData.contents);
    var ss          = SpreadsheetApp.getActiveSpreadsheet();
    var action      = requestData.action || "";

    // ── SAVE SCORE ────────────────────────────────────────────────────────────
    // subjectId = column index (5–25). Writes ONLY to Scores!E3:Y38.
    if (action === "saveScore") {
      var scoresSheet = getScoresSheet(ss);

      var studentId   = String(requestData.studentId);
      var colIndex    = parseInt(requestData.subjectId); // IS the column index directly
      var score       = requestData.score;
      var studentName = requestData.studentName || "Unknown";
      var subjectName = requestData.subjectName || ("Col_" + colIndex);
      var tgUser      = requestData.telegramUser  || "Unknown";

      // Safety check: only allow E(5)–Y(25)
      if (colIndex < 5 || colIndex > 25) {
        return errorOut("saveScore: subjectId out of safe range (5–25). Got: " + colIndex);
      }

      // Find student row in Scores!B3:B38
      var idCol = scoresSheet.getRange("B3:B38").getValues();
      var targetRow = -1;
      for (var i = 0; i < idCol.length; i++) {
        if (String(idCol[i][0]).trim() === studentId) {
          targetRow = 3 + i;
          break;
        }
      }

      if (targetRow < 3 || targetRow > 38) {
        return errorOut("saveScore: student ID not found. ID=" + studentId);
      }

      var oldScore = scoresSheet.getRange(targetRow, colIndex).getValue();
      scoresSheet.getRange(targetRow, colIndex).setValue(score);

      // Audit log
      var auditSheet = getOrCreateAuditSheet(ss);
      auditSheet.appendRow([
        new Date(),
        tgUser,
        studentId,
        studentName,
        subjectName,
        (oldScore === "" || oldScore === null || oldScore === undefined) ? "-" : oldScore,
        (score === "" || score === null) ? "-" : score
      ]);

      return jsonOut({ result: "success" });
    }

    // ── SAVE ACTIVE SUBJECTS ──────────────────────────────────────────────────
    // activeIds = array of column indices (5–25).
    // Updates col C (Active) in Subjects sheet where col A matches.
    // Writes active count to Scores!AD2.
    if (action === "saveActiveSubjects") {
      var subSheet    = getOrCreateSubjectsSheet(ss);
      var scoresSheet = getScoresSheet(ss);
      var tgUser      = requestData.telegramUser || "Unknown";
      var activeIds   = requestData.activeIds    || [];

      var lastRow = subSheet.getLastRow();
      if (lastRow >= 2) {
        var subData = subSheet.getRange(2, 1, lastRow - 1, 1).getValues(); // Col A
        for (var i = 0; i < subData.length; i++) {
          var rowId    = parseInt(subData[i][0]);
          var isActive = activeIds.indexOf(rowId) !== -1;
          subSheet.getRange(2 + i, 3).setValue(isActive); // Col C
        }
      }

      // Write active count to Scores!AD2
      scoresSheet.getRange("AD2").setValue(activeIds.length);

      // Audit
      var auditSheet = getOrCreateAuditSheet(ss);
      auditSheet.appendRow([
        new Date(), tgUser, "-", "-",
        "Subject Config", "-", activeIds.length + " active"
      ]);

      return jsonOut({ result: "success", activeCount: activeIds.length });
    }

    return errorOut("No matching action: " + action);

  } catch (err) {
    return errorOut("doPost exception: " + err.toString());
  }
}
