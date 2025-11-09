const agendaData = Object.freeze([
  {
    id: 'barcelona-club',
    date: '2024-07-12',
    city: 'Barcelona, ES',
    venue: 'Club Nebula',
    type: 'club',
  },
  {
    id: 'lisbon-festival',
    date: '2024-07-27',
    city: 'Lisboa, PT',
    venue: 'Luz & Som Fest',
    type: 'festival',
  },
  {
    id: 'ibiza-privado',
    date: '2024-08-03',
    city: 'Ibiza, ES',
    venue: 'Villa Aurora',
    type: 'privado',
  },
  {
    id: 'berlin-club',
    date: '2024-08-17',
    city: 'Berlin, DE',
    venue: 'Unter Null',
    type: 'club',
  },
  {
    id: 'mexico-festival',
    date: '2024-09-01',
    city: 'Ciudad de México, MX',
    venue: 'Luna Aurora Festival',
    type: 'festival',
  },
]);

const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const agendaList = document.getElementById('agenda-list');
const chipButtons = document.querySelectorAll('.chip');
const bookingForm = document.getElementById('booking-form');
const formSuccess = document.getElementById('form-success');
const currentYear = document.getElementById('current-year');

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'Fecha por confirmar';
  }

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  });
};

const createAgendaItem = ({ id, date, city, venue, type }) => {
  const container = document.createElement('article');
  container.className = 'agenda-item';
  container.setAttribute('role', 'listitem');
  container.dataset.type = type;
  container.id = id;

  const cityElement = document.createElement('div');
  cityElement.className = 'agenda-item__city';
  cityElement.textContent = city;

  const venueElement = document.createElement('div');
  venueElement.className = 'agenda-item__venue';
  venueElement.textContent = `${formatDate(date)} · ${venue}`;

  const badgeElement = document.createElement('span');
  badgeElement.className = 'agenda-item__type';
  badgeElement.textContent = type;

  container.append(cityElement, venueElement, badgeElement);
  return container;
};

const renderAgenda = (filter = 'all') => {
  if (!agendaList) return;

  agendaList.replaceChildren();
  const filtered =
    filter === 'all' ? agendaData : agendaData.filter((item) => item.type === filter);

  if (filtered.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No hay fechas disponibles para esta categoría por ahora.';
    empty.className = 'agenda__empty';
    agendaList.appendChild(empty);
    return;
  }

  filtered
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((event) => {
      agendaList.appendChild(createAgendaItem(event));
    });
};

const setActiveFilter = (button) => {
  chipButtons.forEach((chip) => chip.classList.remove('chip--active'));
  button.classList.add('chip--active');
};

const toggleNavigation = () => {
  navLinks?.classList.toggle('nav__links--open');
};

const closeNavigation = () => {
  navLinks?.classList.remove('nav__links--open');
};

const isFieldElement = (field) =>
  field instanceof HTMLInputElement ||
  field instanceof HTMLTextAreaElement ||
  field instanceof HTMLSelectElement;

const validateField = (field, validator, message) => {
  if (!isFieldElement(field)) return false;
  const errorElement = document.getElementById(`error-${field.id}`);
  if (!validator(field.value.trim())) {
    if (errorElement) errorElement.textContent = message;
    return false;
  }
  if (errorElement) errorElement.textContent = '';
  return true;
};

const validators = {
  name: (value) => value.length >= 2,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  eventType: (value) => value.length > 0,
  message: (value) => value.length >= 10,
};

const getFormData = (form) => {
  const formData = new FormData(form);
  return {
    name: formData.get('name')?.toString().trim() ?? '',
    email: formData.get('email')?.toString().trim() ?? '',
    eventType: formData.get('eventType')?.toString().trim() ?? '',
    message: formData.get('message')?.toString().trim() ?? '',
  };
};

const resetFormMessages = () => {
  if (formSuccess) formSuccess.textContent = '';
  ['name', 'email', 'event-type', 'message'].forEach((field) => {
    const errorElement = document.getElementById(`error-${field}`);
    if (errorElement) errorElement.textContent = '';
  });
};

const getFormFields = () => {
  if (!bookingForm) return [];
  return ['name', 'email', 'eventType', 'message']
    .map((name) => bookingForm.elements.namedItem(name))
    .filter((field) => isFieldElement(field));
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  if (!bookingForm) return;

  resetFormMessages();
  const fields = getFormFields();

  const isValid = fields.every((field) => {
    const validator = validators[field.name];
    const errorMessage =
      field.name === 'name'
        ? 'Introduce al menos 2 caracteres.'
        : field.name === 'email'
        ? 'Introduce un email válido.'
        : field.name === 'eventType'
        ? 'Selecciona un tipo de evento.'
        : 'Describe tu evento con más detalles.';

    return validateField(field, validator ?? (() => true), errorMessage);
  });

  if (!isValid) {
    if (formSuccess) formSuccess.textContent = '';
    return;
  }

  const data = getFormData(bookingForm);
  if (formSuccess) {
    formSuccess.textContent = `Gracias ${data.name}, me pondré en contacto contigo pronto.`;
  }
  bookingForm.reset();
};

const initAgenda = () => {
  renderAgenda();
  chipButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter ?? 'all';
      setActiveFilter(button);
      renderAgenda(filter);
    });
  });
};

const initNavigation = () => {
  navToggle?.addEventListener('click', toggleNavigation);
  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNavigation);
  });
};

const initForm = () => {
  if (!bookingForm) return;
  bookingForm.addEventListener('submit', handleFormSubmit);
};

const initFooter = () => {
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
};

const init = () => {
  initNavigation();
  initAgenda();
  initForm();
  initFooter();
};

init();
