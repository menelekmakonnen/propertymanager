// ============================================
// MOBUS PROPERTY — SEED DATA GENERATOR
// ============================================
// Deterministic generator that produces all transactional data
// from the static property definitions. Runs once on import.

import { properties } from './properties';

// ─── Deterministic PRNG ──────────────────────
function createRng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = createRng(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickN = (arr, n) => {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, n);
};
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const randFloat = (min, max) => min + rand() * (max - min);

// ─── Name Pools ─────────────────────────────
const GHANAIAN_FIRST_MALE = ['Kwame', 'Kofi', 'Kwesi', 'Yaw', 'Kojo', 'Kwaku', 'Nana', 'Nii', 'Emmanuel', 'Daniel', 'Samuel', 'Isaac', 'Joseph', 'Benjamin', 'Michael', 'David', 'Solomon', 'Cyril', 'Desmond', 'Felix', 'Gilbert', 'Henry', 'James', 'Patrick', 'Robert', 'Stephen', 'Thomas', 'Victor', 'William', 'Francis'];
const GHANAIAN_FIRST_FEMALE = ['Ama', 'Abena', 'Akua', 'Yaa', 'Adjoa', 'Akosua', 'Efua', 'Adwoa', 'Grace', 'Mercy', 'Patience', 'Comfort', 'Esther', 'Sarah', 'Rebecca', 'Hannah', 'Naomi', 'Ruth', 'Priscilla', 'Dorcas', 'Felicia', 'Gladys', 'Janet', 'Joyce', 'Linda', 'Margaret', 'Paulina', 'Rose', 'Victoria', 'Cecilia'];
const GHANAIAN_SURNAMES = ['Mensah', 'Asante', 'Boateng', 'Owusu', 'Osei', 'Agyeman', 'Appiah', 'Darko', 'Antwi', 'Opoku', 'Amoah', 'Frimpong', 'Gyasi', 'Baidoo', 'Bonsu', 'Danquah', 'Adjei', 'Yeboah', 'Sarpong', 'Baah', 'Amankwah', 'Ansah', 'Badu', 'Asiamah', 'Acheampong'];
const NIGERIAN_FIRST_MALE = ['Chukwuemeka', 'Oluwaseun', 'Adebayo', 'Chijioke', 'Emeka', 'Nnamdi', 'Obiora', 'Chinedu', 'Tunde', 'Femi', 'Segun', 'Wale', 'Dayo', 'Kunle', 'Gbenga'];
const NIGERIAN_FIRST_FEMALE = ['Chidinma', 'Oluwakemi', 'Ngozi', 'Adaeze', 'Amara', 'Nneka', 'Ifeoma', 'Bunmi', 'Yemi', 'Folake', 'Sade', 'Titilayo', 'Ronke', 'Bisi', 'Aisha'];
const NIGERIAN_SURNAMES = ['Okonkwo', 'Adeyemi', 'Nwosu', 'Obi', 'Eze', 'Okoro', 'Ibrahim', 'Mohammed', 'Abubakar', 'Bello', 'Okafor', 'Nwachukwu', 'Achebe', 'Kanu', 'Onyeama'];
const EXPAT_NAMES = [
  { first: 'Robert', last: 'Anderson' }, { first: 'Sarah', last: 'Mitchell' },
  { first: 'James', last: 'Harrison' }, { first: 'Laura', last: 'Chen' },
  { first: 'David', last: 'Mueller' }, { first: 'Anne-Marie', last: 'Dupont' },
  { first: 'Henrik', last: 'Larsson' }, { first: 'Maria', last: 'Santos' },
  { first: 'Pierre', last: 'Dubois' }, { first: 'Katherine', last: 'Blackwell' },
  { first: 'Thomas', last: 'Wright' }, { first: 'Lisa', last: 'van der Berg' },
  { first: 'Mark', last: 'Thompson' }, { first: 'Julia', last: 'Schmidt' },
  { first: 'Andrew', last: 'Campbell' }, { first: 'Emma', last: 'Johansson' },
];
const CORPORATE_NAMES = [
  'Tullow Oil Ghana', 'MTN Ghana', 'Vodafone Ghana', 'Standard Chartered Bank',
  'Barclays/Absa Ghana', 'Ecobank Ghana', 'PwC Ghana', 'Deloitte Ghana',
  'KPMG Ghana', 'Ernst & Young Ghana', 'Total Energies', 'Newmont Gold',
  'Kosmos Energy', 'Stanbic Bank', 'Société Générale',
];
const MAINTENANCE_DESCS = {
  plumbing: ['Leaking kitchen faucet', 'Blocked bathroom drain', 'Toilet not flushing properly', 'Hot water heater malfunction', 'Water pressure low in bathroom', 'Pipe leak under kitchen sink'],
  electrical: ['Power outlet not working in bedroom', 'Light fixture flickering in living room', 'Circuit breaker keeps tripping', 'Faulty doorbell wiring', 'AC unit electrical fault'],
  structural: ['Crack in bedroom wall', 'Window frame not sealing properly', 'Balcony railing loose', 'Floor tiles cracked in kitchen'],
  hvac: ['AC not cooling effectively', 'Strange noise from AC unit', 'AC remote not responding', 'Ventilation fan not working'],
  general: ['Door handle broken', 'Cabinet hinge loose', 'Paint peeling in bathroom', 'Intercom system not working', 'Smoke detector beeping'],
  pest_control: ['Ant infestation in kitchen', 'Cockroaches spotted in bathroom', 'Termite damage on window frame'],
  landscaping: ['Overgrown hedges blocking pathway', 'Sprinkler system malfunction', 'Tree branch overhanging balcony'],
};
const MAINTENANCE_STAFF_NAMES = ['Kofi Asante', 'Emmanuel Tetteh', 'Isaac Mensah', 'Patrick Osei', 'Joseph Adjei', 'Francis Darko'];

// ─── Unit Generator ─────────────────────────
function generateUnitsForProperty(property) {
  const units = [];
  const { id, code, type, totalUnits, occupancyTarget, rentRange } = property;

  // For in-development properties with no occupancy target, create shell units
  const isManaged = property.status === 'managed';
  const actualUnits = property.phase1Units || totalUnits;
  const unitsToCreate = isManaged ? actualUnits : Math.min(actualUnits, 50); // Cap in-dev

  const unitTypes = getUnitTypesForProperty(property);

  for (let i = 0; i < unitsToCreate; i++) {
    const unitType = unitTypes[i % unitTypes.length];
    const unitNumber = generateUnitNumber(code, type, i, unitsToCreate);
    const floor = getFloorFromUnit(type, i, unitsToCreate);
    const bedsAndBaths = getBedsAndBaths(unitType);
    const size = getSizeForType(unitType);

    let status = 'vacant';
    if (isManaged && occupancyTarget) {
      if (i < occupancyTarget.occupied - (occupancyTarget.shortStay || 0)) {
        status = 'occupied_longterm';
      } else if (i < occupancyTarget.occupied) {
        status = 'occupied_shortterm';
      } else if (i < occupancyTarget.occupied + (occupancyTarget.maintenance || 0)) {
        status = 'under_maintenance';
      }
      // else remains vacant
    }

    let rent = null;
    if (rentRange) {
      const rentByType = {
        studio: rentRange.min,
        '1bed': rentRange.min + (rentRange.max - rentRange.min) * 0.2,
        '2bed': rentRange.min + (rentRange.max - rentRange.min) * 0.5,
        '3bed': rentRange.min + (rentRange.max - rentRange.min) * 0.75,
        '4bed': rentRange.max,
        office: rentRange.min + (rentRange.max - rentRange.min) * 0.6,
        retail: rentRange.min + (rentRange.max - rentRange.min) * 0.4,
      };
      rent = Math.round((rentByType[unitType] || rentRange.min) + randFloat(-100, 100));
      rent = Math.round(rent / 50) * 50; // Round to nearest 50
    }

    units.push({
      id: `unit-${id}-${i}`,
      propertyId: id,
      unitNumber,
      floor,
      bedrooms: bedsAndBaths.beds,
      bathrooms: bedsAndBaths.baths,
      sizeSqm: size,
      type: unitType,
      status,
      rentAmount: rent,
      rentCurrency: property.currency || 'USD',
    });
  }

  return units;
}

function getUnitTypesForProperty(property) {
  if (property.type === 'commercial') {
    return ['office', 'office', 'office', 'office', 'retail'];
  }
  if (property.type === 'townhouse') {
    return ['3bed', '4bed', '3bed', '4bed', '3bed'];
  }
  switch (property.id) {
    case 'prop-park':
      return ['studio', '1bed', '1bed', '2bed', '2bed', '2bed', '3bed', '3bed'];
    case 'prop-knight':
      return ['1bed', '2bed', '2bed', '3bed'];
    case 'prop-capella':
      return ['2bed', '2bed', '3bed', '3bed'];
    case 'prop-ubuntu':
      return ['1bed', '2bed', '2bed', '3bed'];
    default:
      return ['studio', '1bed', '2bed', '3bed'];
  }
}

function generateUnitNumber(code, type, index, total) {
  if (type === 'townhouse') {
    return `${code}-${String(index + 1).padStart(2, '0')}`;
  }
  if (type === 'commercial') {
    const building = ['A', 'B', 'C'][index % 3];
    const floor = Math.floor(index / 3) + 1;
    const suite = (index % 3) + 1;
    return `${code}-${building}${floor}0${suite}`;
  }
  // Apartments: floor-based numbering
  const unitsPerFloor = Math.max(3, Math.ceil(total / 9));
  const floor = Math.floor(index / unitsPerFloor) + 1;
  const unitOnFloor = (index % unitsPerFloor) + 1;
  return `${code}-${floor}0${unitOnFloor}`;
}

function getFloorFromUnit(type, index, total) {
  if (type === 'townhouse') return 0; // ground level
  const unitsPerFloor = Math.max(3, Math.ceil(total / 9));
  return Math.floor(index / unitsPerFloor) + 1;
}

function getBedsAndBaths(unitType) {
  const map = {
    studio: { beds: 0, baths: 1 },
    '1bed': { beds: 1, baths: 1 },
    '2bed': { beds: 2, baths: 2 },
    '3bed': { beds: 3, baths: 2 },
    '4bed': { beds: 4, baths: 3 },
    office: { beds: 0, baths: 1 },
    retail: { beds: 0, baths: 1 },
  };
  return map[unitType] || { beds: 1, baths: 1 };
}

function getSizeForType(unitType) {
  const map = {
    studio: randInt(28, 40),
    '1bed': randInt(45, 65),
    '2bed': randInt(70, 95),
    '3bed': randInt(100, 140),
    '4bed': randInt(160, 220),
    office: randInt(40, 120),
    retail: randInt(50, 150),
  };
  return map[unitType] || randInt(50, 80);
}

// ─── Tenant Generator ───────────────────────
let tenantCounter = 0;

function generateTenant(propertyOrgId, isCorporate = false) {
  tenantCounter++;
  const id = `tenant-${String(tenantCounter).padStart(3, '0')}`;

  if (isCorporate) {
    const name = CORPORATE_NAMES[tenantCounter % CORPORATE_NAMES.length];
    return {
      id,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12)}@corporate.com`,
      phone: `+233 ${randInt(20, 59)} ${randInt(100, 999)} ${randInt(1000, 9999)}`,
      type: 'corporate',
      idDocumentRef: `BRN-${randInt(100000, 999999)}`,
    };
  }

  const isNigerian = propertyOrgId === 'org-nigeria';
  const isExpat = !isNigerian && rand() < 0.2; // 20% expat chance in Ghana

  let first, last;
  if (isExpat) {
    const expat = EXPAT_NAMES[tenantCounter % EXPAT_NAMES.length];
    first = expat.first;
    last = expat.last;
  } else if (isNigerian) {
    const isMale = rand() > 0.5;
    first = isMale ? pick(NIGERIAN_FIRST_MALE) : pick(NIGERIAN_FIRST_FEMALE);
    last = pick(NIGERIAN_SURNAMES);
  } else {
    const isMale = rand() > 0.5;
    first = isMale ? pick(GHANAIAN_FIRST_MALE) : pick(GHANAIAN_FIRST_FEMALE);
    last = pick(GHANAIAN_SURNAMES);
  }

  const phonePrefix = isNigerian ? '+234' : '+233';
  return {
    id,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${pick(['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'])}`,
    phone: `${phonePrefix} ${randInt(20, 59)} ${randInt(100, 999)} ${randInt(1000, 9999)}`,
    type: 'individual',
    idDocumentRef: `${isNigerian ? 'NGN' : 'GHA'}-ID-${randInt(100000, 999999)}`,
  };
}

// ─── Tenancy Generator ──────────────────────
let tenancyCounter = 0;

function generateTenancy(unit, tenant, property) {
  tenancyCounter++;
  const isShortTerm = unit.status === 'occupied_shortterm';
  const isInstitutional = property.isInstitutional;

  // Lease dates: start 6-18 months ago, 12-month terms for long-term
  const startMonthsAgo = isShortTerm ? randInt(0, 1) : randInt(3, 18);
  const startDate = new Date(2026, 3 - startMonthsAgo, randInt(1, 28)); // relative to Apr 2026
  const leaseLengthMonths = isShortTerm ? randInt(1, 3) : (isInstitutional ? 24 : 12);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + leaseLengthMonths);

  // Determine status
  const now = new Date(2026, 3, 14); // April 14, 2026
  let status = 'active';
  const daysUntilEnd = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
  if (daysUntilEnd < 0) status = 'expired';
  else if (daysUntilEnd < 60) status = 'pending_renewal';

  const paymentFreq = isShortTerm ? 'monthly' : pick(['monthly', 'monthly', 'monthly', 'quarterly', 'annually']);

  return {
    id: `tenancy-${String(tenancyCounter).padStart(3, '0')}`,
    unitId: unit.id,
    tenantId: tenant.id,
    propertyId: unit.propertyId,
    type: isShortTerm ? 'short_term' : (isInstitutional ? 'institutional' : 'long_term'),
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    rentAmount: unit.rentAmount,
    rentCurrency: unit.rentCurrency,
    paymentFrequency: paymentFreq,
    depositAmount: isShortTerm ? unit.rentAmount : unit.rentAmount * 2,
    status,
  };
}

// ─── Payment Generator ─────────────────────
let paymentCounter = 0;
const ARREARS_TENANCY_IDS = new Set();

function generatePaymentsForTenancy(tenancy, tenantName, propertyId) {
  const payments = [];
  const months = 6; // 6 months of history
  const now = new Date(2026, 3, 14);

  // Mark some tenancies as having arrears
  const isArrears = (propertyId === 'prop-park' && paymentCounter < 25 && rand() < 0.12) ||
                    (propertyId !== 'prop-park' && rand() < 0.06);
  if (isArrears) ARREARS_TENANCY_IDS.add(tenancy.id);

  for (let m = 0; m < months; m++) {
    paymentCounter++;
    const dueDate = new Date(2026, 3 - m, 1); // 1st of each month, going back
    
    // Skip months before tenancy started
    if (dueDate < new Date(tenancy.startDate)) continue;

    const isPastDue = dueDate < now;
    let status, datePaid, method;

    if (isArrears && m < 2) {
      // Recent months are overdue for arrears cases
      status = m === 0 ? 'overdue' : (rand() < 0.5 ? 'partial' : 'overdue');
      datePaid = null;
      method = null;
    } else if (isPastDue) {
      status = 'paid';
      const payDay = randInt(1, 10);
      datePaid = new Date(dueDate.getFullYear(), dueDate.getMonth(), payDay).toISOString().split('T')[0];
      method = pick(['bank_transfer', 'bank_transfer', 'bank_transfer', 'mobile_money', 'mobile_money', 'cheque']);
    } else {
      status = 'pending';
      datePaid = null;
      method = null;
    }

    const amount = status === 'partial' ? Math.round(tenancy.rentAmount * randFloat(0.3, 0.7)) : tenancy.rentAmount;

    payments.push({
      id: `pmt-${String(paymentCounter).padStart(4, '0')}`,
      tenancyId: tenancy.id,
      tenantName,
      propertyId,
      amount,
      currency: tenancy.rentCurrency,
      dateDue: dueDate.toISOString().split('T')[0],
      datePaid,
      method,
      status,
      receiptRef: status === 'paid' ? `RCP-${propertyId.split('-')[1].toUpperCase()}-${String(paymentCounter).padStart(4, '0')}` : null,
    });
  }

  return payments;
}

// ─── Maintenance Generator ──────────────────
let maintenanceCounter = 0;

function generateMaintenanceForProperty(propertyId, units, propertyOrgId) {
  const requests = [];

  // Determine how many requests based on property
  const occupiedUnits = units.filter(u =>
    u.status === 'occupied_longterm' || u.status === 'occupied_shortterm'
  );
  const maintenanceUnits = units.filter(u => u.status === 'under_maintenance');
  
  // Maintenance units always get a request
  maintenanceUnits.forEach(unit => {
    maintenanceCounter++;
    const cat = pick(Object.keys(MAINTENANCE_DESCS));
    const desc = pick(MAINTENANCE_DESCS[cat]);
    const priority = pick(['medium', 'high', 'emergency']);
    const daysAgo = randInt(1, 14);
    const reportedDate = new Date(2026, 3, 14 - daysAgo);

    requests.push({
      id: `maint-${String(maintenanceCounter).padStart(3, '0')}`,
      unitId: unit.id,
      unitNumber: unit.unitNumber,
      propertyId,
      reportedBy: 'Tenant',
      reportedDate: reportedDate.toISOString().split('T')[0],
      category: cat,
      description: desc,
      priority,
      status: pick(['reported', 'assessed', 'in_progress']),
      assignedTo: pick(MAINTENANCE_STAFF_NAMES),
      cost: priority === 'emergency' ? randInt(200, 800) : randInt(50, 300),
      costCurrency: propertyOrgId === 'org-nigeria' ? 'NGN' : 'USD',
      completedDate: null,
    });
  });

  // Additional requests from occupied units
  const additionalCount = propertyId === 'prop-park' ? randInt(6, 10) :
                          propertyId === 'prop-richfield' ? randInt(3, 5) :
                          randInt(1, 3);
  
  const selectedUnits = pickN(occupiedUnits, Math.min(additionalCount, occupiedUnits.length));
  
  selectedUnits.forEach(unit => {
    maintenanceCounter++;
    const cat = pick(Object.keys(MAINTENANCE_DESCS));
    const desc = pick(MAINTENANCE_DESCS[cat]);
    const priority = pick(['low', 'low', 'medium', 'medium', 'high']);
    const daysAgo = randInt(1, 45);
    const reportedDate = new Date(2026, 3, 14 - daysAgo);
    
    const statuses = ['reported', 'assessed', 'in_progress', 'completed', 'verified'];
    // Older requests more likely to be completed
    const statusIndex = daysAgo > 30 ? randInt(3, 4) : daysAgo > 14 ? randInt(1, 3) : randInt(0, 2);

    let completedDate = null;
    if (statusIndex >= 3) {
      completedDate = new Date(reportedDate);
      completedDate.setDate(completedDate.getDate() + randInt(2, 10));
      completedDate = completedDate.toISOString().split('T')[0];
    }

    requests.push({
      id: `maint-${String(maintenanceCounter).padStart(3, '0')}`,
      unitId: unit.id,
      unitNumber: unit.unitNumber,
      propertyId,
      reportedBy: 'Tenant',
      reportedDate: reportedDate.toISOString().split('T')[0],
      category: cat,
      description: desc,
      priority,
      status: statuses[statusIndex],
      assignedTo: statusIndex > 0 ? pick(MAINTENANCE_STAFF_NAMES) : null,
      cost: statusIndex >= 3 ? randInt(50, 500) : null,
      costCurrency: propertyOrgId === 'org-nigeria' ? 'NGN' : 'USD',
      completedDate,
    });
  });

  return requests;
}

// ─── Short-Term Booking Generator ───────────
let bookingCounter = 0;

function generateBookingsForUnit(unit) {
  const bookings = [];
  const numBookings = randInt(3, 8);

  for (let i = 0; i < numBookings; i++) {
    bookingCounter++;
    const daysOffset = randInt(-60, 30);
    const checkIn = new Date(2026, 3, 14 + daysOffset);
    const nights = randInt(2, 14);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + nights);
    const nightlyRate = randInt(80, 200);

    const guestFirstNames = ['John', 'Emma', 'Kwaku', 'Ama', 'Pierre', 'Sofia', 'Chen', 'Fatima', 'Hans', 'Yuki'];
    const guestLastNames = ['Smith', 'Brown', 'Asante', 'Mensah', 'Dupont', 'Garcia', 'Wang', 'Ibrahim', 'Fischer', 'Tanaka'];

    bookings.push({
      id: `booking-${String(bookingCounter).padStart(3, '0')}`,
      unitId: unit.id,
      unitNumber: unit.unitNumber,
      propertyId: unit.propertyId,
      guestName: `${pick(guestFirstNames)} ${pick(guestLastNames)}`,
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      nights,
      nightlyRate,
      totalAmount: nightlyRate * nights,
      currency: 'USD',
      status: daysOffset < -7 ? 'completed' : daysOffset < 0 ? 'in_progress' : 'confirmed',
      source: pick(['Direct', 'Airbnb', 'Booking.com', 'Direct', 'Airbnb']),
    });
  }

  return bookings.sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
}

// ═════════════════════════════════════════════
// MAIN GENERATION
// ═════════════════════════════════════════════

export function generateAllData() {
  const allUnits = [];
  const allTenants = [];
  const allTenancies = [];
  const allPayments = [];
  const allMaintenance = [];
  const allBookings = [];

  const managedProperties = properties.filter(p => p.status === 'managed');
  const devProperties = properties.filter(p => p.status === 'in_development');

  // Generate for managed properties
  managedProperties.forEach(property => {
    const units = generateUnitsForProperty(property);
    allUnits.push(...units);

    const occupiedUnits = units.filter(u =>
      u.status === 'occupied_longterm' || u.status === 'occupied_shortterm'
    );

    // Generate tenants and tenancies for occupied units
    occupiedUnits.forEach(unit => {
      const isCorporate = property.type === 'commercial';
      const tenant = generateTenant(property.orgId, isCorporate);
      allTenants.push(tenant);

      const tenancy = generateTenancy(unit, tenant, property);
      allTenancies.push(tenancy);

      // Generate payments
      const payments = generatePaymentsForTenancy(tenancy, tenant.name, property.id);
      allPayments.push(...payments);

      // Generate bookings for short-stay units
      if (unit.status === 'occupied_shortterm') {
        const bookings = generateBookingsForUnit(unit);
        allBookings.push(...bookings);
      }
    });

    // Generate maintenance
    const maintenanceReqs = generateMaintenanceForProperty(property.id, units, property.orgId);
    allMaintenance.push(...maintenanceReqs);
  });

  // Generate shell units for in-development properties
  devProperties.forEach(property => {
    const units = generateUnitsForProperty(property);
    allUnits.push(...units);
  });

  return {
    units: allUnits,
    tenants: allTenants,
    tenancies: allTenancies,
    payments: allPayments,
    maintenance: allMaintenance,
    bookings: allBookings,
  };
}

// Generate once and export
const seedData = generateAllData();

export const units = seedData.units;
export const tenants = seedData.tenants;
export const tenancies = seedData.tenancies;
export const payments = seedData.payments;
export const maintenance = seedData.maintenance;
export const bookings = seedData.bookings;
