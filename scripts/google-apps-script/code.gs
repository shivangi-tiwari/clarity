/**
 * Google Apps Script: Unified Website Form Handler
 *
 * Paste this entire script into script.google.com as a new project.
 * 1. Set SPREADSHEET_ID to your Google Sheet ID (found in the Google Sheet's URL).
 * 2. Set OWNER_EMAIL to receive email notifications.
 * 3. Deploy as a Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone (or Anyone, even anonymous)
 * 4. Copy the Web App URL and add it as GOOGLE_APPS_SCRIPT_URL in your .env.local file.
 */

const OWNER_EMAIL = 'workacc722@gmail.com'; // Change if needed
const SPREADSHEET_ID = '1OiEcxGLBL2206fxVBrh5B7W9cBX00CJYI5V9Fkz6Gbo'; // Replace with your Google Sheet ID if needed, or leave blank to use the active spreadsheet

// Column definitions for each sheet type to ensure consistent layout
const SCHEMAS = {
  booking: [
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'date', label: 'Preferred Date' },
    { key: 'timeSlot', label: 'Time Slot' },
    { key: 'sessionType', label: 'Session Type' },
    { key: 'message', label: 'Message' }
  ],
  contact: [
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'message', label: 'Message' }
  ],
  intake: [
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'preferredName', label: 'Preferred Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'occupation', label: 'Occupation' },
    { key: 'currentSituation', label: 'Current Situation' },
    { key: 'hopedChange', label: 'Hoped Change' },
    { key: 'supportAreas', label: 'Support Areas' },
    { key: 'alreadyTried', label: 'Already Tried' },
    { key: 'supportNeeded', label: 'Support Needed' },
    { key: 'successStatement', label: 'Success Statement' },
    { key: 'anythingElse', label: 'Anything Else' }
  ],
  session: [
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'clientIdentifier', label: 'Client Name/Email' },
    { key: 'sessionDate', label: 'Session Date' },
    { key: 'sessionNumber', label: 'Session #' },
    { key: 'mostImportant', label: 'Most Important Discussion' },
    { key: 'stoodOut', label: 'What Stood Out' },
    { key: 'feelingLeaving', label: 'Feeling Leaving' },
    { key: 'insightCarry', label: 'Insight to Carry' },
    { key: 'gentleWith', label: 'Self-Compassion Area' },
    { key: 'nextSteps', label: 'Next Steps Selected' },
    { key: 'nextStepDetails', label: 'Next Step Details' },
    { key: 'supportSelf', label: 'Self Support Plan' },
    { key: 'confidenceRating', label: 'Confidence Rating (1-10)' },
    { key: 'focusBeforeNext', label: 'Focus Before Next' },
    { key: 'exploreNext', label: 'To Explore Next' },
    { key: 'wordForward', label: 'Word to Carry Forward' }
  ],
  testimonial: [
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'context', label: 'Context (e.g. Coaching Journey Client)' },
    { key: 'quote', label: 'Testimonial Quote' },
    { key: 'approved', label: 'Approved (TRUE/FALSE)' }
  ]
};

const SHEET_NAMES = {
  booking: 'Bookings',
  contact: 'ContactMessages',
  intake: 'IntakeForm',
  session: 'SessionReflections',
  testimonial: 'Testimonials'
};

function _normalizeValue(v) {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.join(', ');
  return String(v);
}

/**
 * Handle GET requests
 * Fetch testimonials for the frontend
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === 'getTestimonials') {
      const ss = _getSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAMES.testimonial);
      if (!sheet) {
        return _jsonResponse([]);
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return _jsonResponse([]);
      }
      
      const headers = data[0].map(h => String(h).trim());
      const rows = [];
      for (let i = 1; i < data.length; i++) {
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = data[i][j];
        }
        rows.push(row);
      }
      
      // Clean row key mapping to make sure they match expected frontend keys (id, name, context, quote, approved)
      const cleanedRows = rows.map(r => {
        const getVal = (possibleKeys, defaultVal = '') => {
          for (const key of possibleKeys) {
            if (r[key] !== undefined && r[key] !== null && String(r[key]).trim() !== '') {
              return String(r[key]).trim();
            }
          }
          return defaultVal;
        };

        const name = getVal(['Name', 'name', 'Client Name', 'Full Name', 'fullName', 'Preferred Name'], 'Anonymous');
        const context = getVal(['Context (e.g. Coaching Journey Client)', 'context', 'Context', 'Session Type', 'coaching type', 'Coaching Journey'], 'Client');
        const quote = getVal(['Testimonial Quote', 'quote', 'Feedback', 'Your Feedback', 'feedback', 'Testimonial', 'Message', 'message'], '');
        const approvedVal = getVal(['Approved (TRUE/FALSE)', 'approved', 'Approved', 'Status'], 'TRUE');
        
        // If it's explicitly 'false', 'f', 'no', 'n', it is not approved. Otherwise approved is true.
        const approved = (approvedVal.toLowerCase() === 'false' || approvedVal.toLowerCase() === 'f' || approvedVal.toLowerCase() === 'no' || approvedVal.toLowerCase() === 'n') ? 'FALSE' : 'TRUE';

        return {
          id: r['ID'] || r['id'] || Math.random().toString(36).slice(2, 9),
          name: name,
          context: context,
          quote: quote,
          approved: approved
        };
      });
      
      return _jsonResponse(cleanedRows);
    }
    
    return _jsonResponse({ status: 'ok', message: 'Send a POST request to submit form data, or GET with action=getTestimonials to fetch testimonials.' });
  } catch (err) {
    return _jsonResponse({ status: 'error', message: err.message });
  }
}

/**
 * Handle POST requests
 * Receive and save form data
 */
function doPost(e) {
  try {
    const raw = e.postData && e.postData.contents ? e.postData.contents : null;
    if (!raw) {
      return _jsonResponse({ status: 'error', message: 'No payload received' });
    }
    const data = JSON.parse(raw);
    
    // Determine the form type
    let formType = data.formType;
    if (!formType) {
      // Guess type based on keys
      if (data.fullName && data.occupation) formType = 'intake';
      else if (data.clientIdentifier) formType = 'session';
      else if (data.sessionType && data.timeSlot) formType = 'booking';
      else if (data.quote) formType = 'testimonial';
      else formType = 'contact';
    }
    
    const sheetName = SHEET_NAMES[formType];
    const schema = SCHEMAS[formType];
    
    if (!sheetName || !schema) {
      return _jsonResponse({ status: 'error', message: 'Unknown form type: ' + formType });
    }
    
    const ss = _getSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    // Set headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = schema.map(col => col.label);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
    
    // Build row values based on schema mapping
    const nowStr = new Date().toLocaleString();
    const rowValues = schema.map(col => {
      if (col.key === 'timestamp') return nowStr;
      if (col.key === 'approved') return data[col.key] !== undefined ? String(data[col.key]).toUpperCase() : 'FALSE';
      return _normalizeValue(data[col.key]);
    });
    
    sheet.appendRow(rowValues);
    
    // Send email notification to owner
    if (OWNER_EMAIL) {
      try {
        let htmlBody = '<h2>New ' + sheetName + ' Submission</h2><ul>';
        schema.forEach(col => {
          if (col.key !== 'timestamp') {
            htmlBody += '<li><strong>' + col.label + ':</strong> ' + _normalizeValue(data[col.key]) + '</li>';
          }
        });
        htmlBody += '</ul>';
        
        MailApp.sendEmail({
          to: OWNER_EMAIL,
          subject: 'New Website Submission: ' + sheetName,
          htmlBody: htmlBody
        });
      } catch (mailErr) {
        console.error('Email failed to send: ' + mailErr.message);
      }
    }
    
    return _jsonResponse({ status: 'ok', message: 'Data saved successfully to sheet ' + sheetName });
  } catch (err) {
    return _jsonResponse({ status: 'error', message: err.message });
  }
}

/**
 * Helper to get the correct spreadsheet
 */
function _getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Helper to format response as JSON
 */
function _jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
