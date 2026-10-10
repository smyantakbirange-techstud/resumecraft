const $ = (id) => document.getElementById(id);
const fields = {
  fullName: 'previewName', jobTitle: 'previewTitle', email: 'previewEmail',
  phone: 'previewPhone', location: 'previewLocation', website: 'previewWebsite',
  summary: 'previewSummary', degree: 'previewDegree', college: 'previewCollege',
  gradYear: 'previewYear', grade: 'previewGrade', experience: 'previewExperience',
  certifications: 'previewCertifications'
};
const sampleValues = {};
Object.keys(fields).forEach(id => sampleValues[id] = $(id).value);
sampleValues.skills = $('skills').value;

function setText(id, value, fallback = '') {
  $(id).textContent = value.trim() || fallback;
}
function updatePreview() {
  Object.entries(fields).forEach(([inputId, previewId]) => setText(previewId, $(inputId).value, ''));
  const skillValues = $('skills').value.split(',').map(s => s.trim()).filter(Boolean);
  const skillsContainer = $('previewSkills');
  skillsContainer.replaceChildren();
  skillValues.forEach(skill => {
    const chip = document.createElement('span');
    chip.textContent = skill;
    skillsContainer.appendChild(chip);
  });
  $('summarySection').hidden = !$('summary').value.trim();
  $('certSection').hidden = !$('certifications').value.trim();
  showToast('Resume preview updated');
}
function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400);
}
Object.keys(fields).concat('skills').forEach(id => {
  $(id).addEventListener('input', () => {
    // Keep the preview live while the user edits.
    Object.entries(fields).forEach(([inputId, previewId]) => setText(previewId, $(inputId).value, ''));
    const skillsContainer = $('previewSkills');
    skillsContainer.replaceChildren();
    $('skills').value.split(',').map(s => s.trim()).filter(Boolean).forEach(skill => {
      const chip = document.createElement('span');
      chip.textContent = skill;
      skillsContainer.appendChild(chip);
    });
    $('summarySection').hidden = !$('summary').value.trim();
    $('certSection').hidden = !$('certifications').value.trim();
  });
});
$('refreshPreview').addEventListener('click', updatePreview);
$('resetForm').addEventListener('click', () => {
  Object.entries(sampleValues).forEach(([id, value]) => $(id).value = value);
  updatePreview();
  showToast('Sample details restored');
});
$('printResume').addEventListener('click', () => {
  updatePreview();
  window.print();
});
let currentTemplate = 'classic';
function setTemplate(template) {
  currentTemplate = template;
  const doc = $('resumeDocument');
  doc.classList.remove('style-modern', 'style-minimal');
  if (template === 'modern') doc.classList.add('style-modern');
  if (template === 'minimal') doc.classList.add('style-minimal');
  document.querySelectorAll('.template-card').forEach(card => {
    const selected = card.dataset.template === template;
    card.classList.toggle('selected', selected);
    card.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
  showToast(template.charAt(0).toUpperCase() + template.slice(1) + ' style selected');
}
document.querySelectorAll('.template-card').forEach(card => {
  card.addEventListener('click', () => setTemplate(card.dataset.template));
});
$('templateToggle').addEventListener('click', () => {
  const templates = ['classic', 'modern', 'minimal'];
  setTemplate(templates[(templates.indexOf(currentTemplate) + 1) % templates.length]);
});
function goToBuilder() {
  $('builder').scrollIntoView({behavior: 'smooth'});
  setTimeout(() => $('fullName').focus({preventScroll:true}), 450);
}
['topStart', 'heroStart', 'bottomStart'].forEach(id => $(id).addEventListener('click', goToBuilder));
$('mobileMenu').addEventListener('click', () => {
  const nav = document.querySelector('.nav-links');
  nav.classList.toggle('open');
  $('mobileMenu').setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open')));
updatePreview();
