const OWNER_EMAIL = 'workacc722@gmail.com';
const SPREADSHEET_ID = '1OiEcxGLBL2206fxVBrh5B7W9cBX00CJYI5V9Fkz6Gbo';

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
    { key: 'anythingElse', label: 'Anything Else' },
    { key: 'ownerNotes', label: 'Owner Notes' }
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
    { key: 'wordForward', label: 'Word to Carry Forward' },
    { key: 'sessionNotes', label: 'Session Notes' }
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

function _getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function _jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function _sendEmailNotification(formType, payload) {
  try {
    const subject = `New ${formType.charAt(0).toUpperCase() + formType.slice(1)} Submission`;
    let body = `${subject}\n\n`;
    
    for (const [key, value] of Object.entries(payload)) {
      if (key !== 'action' && key !== 'formType') {
        const displayValue = Array.isArray(value) ? value.join(', ') : (value || '—');
        body += `${key}: ${displayValue}\n`;
      }
    }
    
    GmailApp.sendEmail(OWNER_EMAIL, subject, body);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

function _dashStyle() {
  return `
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; display: flex; background-color: #f8fafc; color: #1e293b; }
    .sidebar { width: 260px; background-color: #0f172a; color: white; height: 100vh; position: fixed; top: 0; left: 0; padding-top: 1.5rem; box-sizing: border-box; }
    .nav-link { display: block; padding: 0.85rem 1.5rem; color: #94a3b8; text-decoration: none; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .nav-link:hover { background-color: #1e293b; color: #f8fafc; }
    .nav-link.active { background-color: #2563eb; color: white; font-weight: 600; }
    .main { margin-left: 260px; padding: 2.5rem; width: calc(100% - 260px); box-sizing: border-box; background-color: #f8fafc; min-height: 100vh; }
    h2 { margin-top: 0; margin-bottom: 1.5rem; color: #0f172a; font-size: 1.75rem; display: flex; align-items: center; gap: 0.75rem; }
    .count { background-color: #e2e8f0; font-size: 0.875rem; padding: 0.25rem 0.75rem; border-radius: 9999px; color: #475569; font-weight: 600; }
    .back { display: inline-flex; align-items: center; margin-bottom: 1.5rem; color: #2563eb; text-decoration: none; font-weight: 600; cursor: pointer; font-size: 1rem; }
    .back:hover { text-decoration: underline; }
    .card { background-color: #ffffff; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03); border: 1px solid #e2e8f0; }
    .detail-table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
    .detail-table tr:last-child td { border-bottom: none; }
    .detail-table td { padding: 1rem 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; font-size: 1rem; line-height: 1.5; }
    .label { font-weight: 600; color: #475569; width: 28%; padding-right: 1rem; }
    .value { color: #0f172a; }
    .list { display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem; }
    .list-item { background-color: #ffffff; padding: 1.25rem 1.5rem; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; border-left: 5px solid #2563eb; text-decoration: none; color: inherit; display: block; cursor: pointer; transition: all 0.2s ease; }
    .list-item:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05); border-color: #cbd5e1; }
    .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .item-name { font-size: 1.15rem; font-weight: 600; color: #0f172a; }
    .item-time { font-size: 0.875rem; color: #64748b; font-weight: 500; background-color: #f1f5f9; padding: 0.2rem 0.6rem; border-radius: 6px; }
    .item-sub { font-size: 0.95rem; color: #475569; display: flex; align-items: center; }
    .empty { color: #64748b; font-style: italic; background: #ffffff; padding: 2rem; text-align: center; border-radius: 10px; border: 1px dashed #cbd5e1; }
  `;
}

function _normalizeValue(v) {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.join(', ');
  if (v instanceof Date) {
    if (v.getFullYear() === 1899) {
      return v.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
    return v.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  return String(v);
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const baseUrl = ScriptApp.getService().getUrl();

    if (action === 'getTestimonials') {
      const ss = _getSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAMES.testimonial);
      if (!sheet) return _jsonResponse([]);
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) return _jsonResponse([]);
      const headers = data[0].map(h => String(h).trim());
      const rows = [];
      for (let i = 1; i < data.length; i++) {
        const row = {};
        for (let j = 0; j < headers.length; j++) row[headers[j]] = data[i][j];
        rows.push(row);
      }
      const cleanedRows = rows.map(r => {
        const getVal = (keys, def = '') => {
          for (const k of keys) {
            if (r[k] !== undefined && String(r[k]).trim()) return String(r[k]).trim();
          }
          return def;
        };
        const approvedVal = getVal(['Approved (TRUE/FALSE)', 'approved', 'Approved', 'Status'], 'TRUE');
        const approved = ['false', 'f', 'no', 'n'].includes(approvedVal.toLowerCase()) ? 'FALSE' : 'TRUE';
        return {
          id: r['ID'] || r['id'] || Math.random().toString(36).slice(2, 9),
          name: getVal(['Name', 'name', 'Full Name', 'fullName'], 'Anonymous'),
          context: getVal(['Context (e.g. Coaching Journey Client)', 'context', 'Context'], 'Client'),
          quote: getVal(['Testimonial Quote', 'quote', 'Feedback', 'Message'], ''),
          approved
        };
      });
      return _jsonResponse(cleanedRows);
    }

    if (action === 'getClients') {
      const ss = _getSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAMES.intake);
      if (!sheet) return _jsonResponse([]);
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) return _jsonResponse([]);
      const headers = data[0].map(h => String(h).trim());
      const clients = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const getIdx = (label) => headers.indexOf(label);
        const client = {
          id: String(row[0]) + '_' + i,
          fullName: row[getIdx('Full Name')] || '',
          preferredName: row[getIdx('Preferred Name')] || '',
          email: row[getIdx('Email')] || '',
          phone: row[getIdx('Phone')] || '',
          city: row[getIdx('City')] || '',
          occupation: row[getIdx('Occupation')] || '',
          currentSituation: row[getIdx('Current Situation')] || '',
          hopedChange: row[getIdx('Hoped Change')] || '',
          supportAreas: (row[getIdx('Support Areas')] || '').split(', ').filter(a => a),
          alreadyTried: row[getIdx('Already Tried')] || '',
          supportNeeded: row[getIdx('Support Needed')] || '',
          successStatement: row[getIdx('Success Statement')] || '',
          anythingElse: row[getIdx('Anything Else')] || '',
          ownerNotes: row[getIdx('Owner Notes')] || ''
        };
        clients.push(client);
      }
      return _jsonResponse(clients);
    }

    if (action === 'getSessions') {
      const email = e.parameter.email;
      if (!email) return _jsonResponse([]);
      const ss = _getSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAMES.session);
      if (!sheet) return _jsonResponse([]);
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) return _jsonResponse([]);
      const headers = data[0].map(h => String(h).trim());
      const sessions = [];
      const searchEmail = String(email).toLowerCase().trim();
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const clientEmail = String(row[headers.indexOf('Client Name/Email')] || '').toLowerCase().trim();
        if (clientEmail === searchEmail) {
          const session = {
            id: 'session_' + i,
            sessionDate: row[headers.indexOf('Session Date')] || '',
            sessionNumber: row[headers.indexOf('Session #')] || '',
            mostImportant: row[headers.indexOf('Most Important Discussion')] || '',
            stoodOut: row[headers.indexOf('What Stood Out')] || '',
            sessionNotes: row[headers.indexOf('Session Notes')] || ''
          };
          sessions.push(session);
        }
      }
      return _jsonResponse(sessions);
    }

    const sheetParam = e.parameter.sheet || 'Bookings';
    const rowParam = e.parameter.row;
    const ss = _getSpreadsheet();
    const sheetNames = ['Bookings', 'ContactMessages', 'IntakeForm', 'SessionReflections', 'Testimonials'];

    if (rowParam) {
      try {
        const sheet = ss.getSheetByName(sheetParam);
        if (!sheet) return HtmlService.createHtmlOutput('<p style="padding:2rem">Sheet not found.</p>').setTitle('Error');
        const data = sheet.getDataRange().getValues();
        const rowIndex = parseInt(rowParam);
        if (rowIndex >= data.length) return HtmlService.createHtmlOutput('<p style="padding:2rem">Row not found.</p>').setTitle('Error');
        const headers = data[0];
        const row = data[rowIndex];
        let html = '<html><head><style>' + _dashStyle() + '</style></head><body>';
        html += '<div class="sidebar">';
        sheetNames.forEach(function(name) {
          html += '<a href="javascript:void(0);" onclick="window.top.location.href=\'' + baseUrl + '?sheet=' + name + '\'" class="nav-link">' + name + '</a>';
        });
        html += '</div><div class="main">';
        html += '<a href="javascript:void(0);" onclick="window.top.location.href=\'' + baseUrl + '?sheet=' + sheetParam + '\'" class="back">← Back to ' + sheetParam + '</a>';
        html += '<div class="card"><h2>' + sheetParam + ' Record Detail</h2><table class="detail-table">';
        headers.forEach(function(h, i) {
          const val = _normalizeValue(row[i]);
          html += '<tr><td class="label">' + h + '</td><td class="value">' + (val || '—') + '</td></tr>';
        });
        html += '</table></div></div></body></html>';
        return HtmlService.createHtmlOutput(html).setTitle('Record Detail');
      } catch (err) {
        return HtmlService.createHtmlOutput('<p style="color:red;padding:2rem">Detail error: ' + err.message + '</p>').setTitle('Error');
      }
    }

    let html = '<html><head><style>' + _dashStyle() + '</style></head><body>';
    html += '<div class="sidebar">';
    sheetNames.forEach(function(name) {
      html += '<a href="javascript:void(0);" onclick="window.top.location.href=\'' + baseUrl + '?sheet=' + name + '\'" class="nav-link ' + (name === sheetParam ? 'active' : '') + '">' + name + '</a>';
    });
    html += '</div><div class="main">';
    const sheet = ss.getSheetByName(sheetParam);
    if (!sheet) {
      html += '<p class="empty">No submissions found for ' + sheetParam + '.</p>';
    } else {
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        html += '<p class="empty">No submissions yet inside ' + sheetParam + '.</p>';
      } else {
        const headers = data[0];
        const nameIdx = headers.findIndex(function(h) { return ['Full Name', 'Name', 'Client Name/Email'].includes(String(h)); });
        const emailIdx = headers.findIndex(function(h) { return String(h).toLowerCase().includes('email'); });
        html += '<h2>' + sheetParam + ' <span class="count">' + (data.length - 1) + '</span></h2>';
        html += '<div class="list">';
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const name = nameIdx >= 0 ? _normalizeValue(row[nameIdx]) : 'Entry #' + i;
          const email = emailIdx >= 0 ? _normalizeValue(row[emailIdx]) : '';
          const time = _normalizeValue(row[0]);
          html += '<a href="javascript:void(0);" onclick="window.top.location.href=\'' + baseUrl + '?sheet=' + sheetParam + '&row=' + i + '\'" class="list-item">';
          html += '<div class="item-header"><span class="item-name">' + name + '</span><span class="item-time">' + time + '</span></div>';
          if (email) html += '<div class="item-sub">' + email + '</div>';
          html += '</a>';
        }
        html += '</div>';
      }
    }
    html += '</div></body></html>';
    return HtmlService.createHtmlOutput(html).setTitle('Dashboard');
  } catch (globalErr) {
    return HtmlService.createHtmlOutput('<p style="color:red;padding:2rem">Global error: ' + globalErr.message + '</p>').setTitle('Error');
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    if (action === 'updateClientNotes') {
      const ss = _getSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAMES.intake);
      if (!sheet) return _jsonResponse({ error: 'IntakeForm sheet not found' });
      const data = sheet.getDataRange().getValues();
      const headers = data[0].map(h => String(h).trim());
      const emailIdx = headers.indexOf('Email');
      let ownerNotesIdx = headers.indexOf('Owner Notes');
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][emailIdx]).toLowerCase() === String(payload.email).toLowerCase()) {
          if (ownerNotesIdx === -1) {
            sheet.appendRow(['Owner Notes']);
            sheet.getRange(i + 1, headers.length + 1).setValue(payload.ownerNotes);
          } else {
            sheet.getRange(i + 1, ownerNotesIdx + 1).setValue(payload.ownerNotes);
          }
          return _jsonResponse({ success: true, message: 'Notes updated' });
        }
      }
      return _jsonResponse({ error: 'Client not found' });
    }

    if (action === 'updateSessionNotes') {
      const ss = _getSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAMES.session);
      if (!sheet) return _jsonResponse({ error: 'SessionReflections sheet not found' });
      const data = sheet.getDataRange().getValues();
      const headers = data[0].map(h => String(h).trim());
      const emailIdx = headers.indexOf('Client Name/Email');
      let notesIdx = headers.indexOf('Session Notes');
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][emailIdx]).toLowerCase() === String(payload.email).toLowerCase()) {
          if (notesIdx === -1) {
            sheet.appendRow(['Session Notes']);
            sheet.getRange(i + 1, headers.length + 1).setValue(payload.sessionNotes);
          } else {
            sheet.getRange(i + 1, notesIdx + 1).setValue(payload.sessionNotes);
          }
          return _jsonResponse({ success: true, message: 'Session notes updated' });
        }
      }
      return _jsonResponse({ error: 'Session not found' });
    }

    const formType = payload.formType;
    if (!formType || !SCHEMAS[formType]) return _jsonResponse({ error: 'Invalid form type: ' + formType });
    const ss = _getSpreadsheet();
    const sheetName = SHEET_NAMES[formType];
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      const schema = SCHEMAS[formType];
      const headers = schema.map(s => s.label);
      sheet.appendRow(headers);
    }
    const schema = SCHEMAS[formType];
    const rowData = [];
    rowData.push(new Date().toLocaleString('en-IN'));
    for (let i = 1; i < schema.length; i++) {
      const key = schema[i].key;
      let value = payload[key];
      if (Array.isArray(value)) value = value.join(', ');
      rowData.push(value || '');
    }
    sheet.appendRow(rowData);

    _sendEmailNotification(formType, payload);

    return _jsonResponse({ success: true, message: 'Form submitted successfully', formType: formType });
  } catch (error) {
    return _jsonResponse({ error: 'Error processing form: ' + error.message });
  }
}
