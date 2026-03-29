// Services Data
const services = {
    femme: [
        { name: "tissage ouvert", duration: "3h 20min", price: 50 },
        { name: "tissage tressé", duration: "4h 20min", price: 55 },
        { name: "Soft locs", duration: "6h", price: 60 },
        { name: "Jayda Wayda braids (Fulani braids tissage derrière)", duration: "3h 20min", price: 55 },
        { name: "Boho knottles braids (medium)", duration: "6h", price: 65 },
        { name: "Island twist", duration: "5h", price: 70 },
        { name: "invisible locs + barrel devant", duration: "4h", price: 60 },
        { name: "knottles braids (medium) shoulder lenght", duration: "6h", price: 60 },
        { name: "invisible locs", duration: "4h", price: 60 },
        { name: "fulani braids", duration: "6h", price: 65 },
        { name: "Passion twist", duration: "4h", price: 65 },
        { name: "Knotless braids medium (back lenght)", duration: "5h", price: 65 },
        { name: "Nattes avec motifs (avec mèches)", duration: "1h 20min", price: 55 },
        { name: "nattes simple (avec mèches)", duration: "50min", price: 50 },
        { name: "barrel twist", duration: "1h 30min", price: 45 },
        { name: "nattes simple", duration: "50min", price: 30 },
        { name: "Barrel twist + extensions", duration: "2h", price: 55 },
        { name: "Nattes avec motifs", duration: "40min", price: 35 }
    ],
    homme: [
        { name: "Flat twist", duration: "1h 30min", price: 40 },
        { name: "twist/vanilles", duration: "1h 30min", price: 45 },
        { name: "barrel twist", duration: "1h 30min", price: 45 },
        { name: "nattes simple", duration: "50min", price: 30 },
        { name: "Fulani braids men", duration: "1h 30min", price: 45 },
        { name: "Box braids men", duration: "1h", price: 45 },
        { name: "Barrel twist + extensions", duration: "2h", price: 55 },
        { name: "Nattes avec motifs", duration: "40min", price: 35 },
        { name: "Vanille+ barrel twist", duration: "1h 30min", price: 45 }
    ],
    locs: [
        { name: "retwist simple", duration: "1h 30min", price: 60 },
        { name: "retwist avec vanille", duration: "1h 30min", price: 60 },
        { name: "retwist avec barrel twist", duration: "2h", price: 65 },
        { name: "Départ de locs au peigne", duration: "2h", price: 90 },
        { name: "Départ de locs en vanille/twist", duration: "2h", price: 80 }
    ]
};

// Global variables
let currentStep = 1;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeServices();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Category tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayServices(btn.dataset.category);
        });
    });

    // Contact form
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Merci pour votre message! Je vous répondrai bientôt.');
        e.target.reset();
    });

    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Expiry date formatting
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // CVV number only
    const cardCvvInput = document.getElementById('cardCvv');
    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Initialize Services Display
function initializeServices() {
    displayServices('femme');
}

// Display Services
function displayServices(category) {
    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = '';

    services[category].forEach(service => {
        const card = createServiceCard(service);
        grid.appendChild(card);
    });
}

// Create Service Card
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
        <h3>${service.name}</h3>
        <div class="service-info">
            <span class="service-duration">
                <i class="fas fa-clock"></i> ${service.duration}
            </span>
            <span class="service-price">${service.price} €</span>
        </div>
        <button class="btn btn-primary" onclick="selectServiceAndBook('${service.name}', '${service.duration}', ${service.price})">
            Réserver
        </button>
    `;
    return card;
}

// Select Service and Open Booking
function selectServiceAndBook(name, duration, price) {
    selectedService = { name, duration, price };
    openBooking();
    
    // Pre-select the service in the modal
    setTimeout(() => {
        const serviceOptions = document.querySelectorAll('.service-option');
        serviceOptions.forEach(option => {
            if (option.dataset.name === name) {
                option.click();
            }
        });
    }, 100);
}

// Open Booking Modal
function openBooking() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset to step 1
    currentStep = 1;
    updateStepDisplay();
    
    // Initialize modal services
    initializeModalServices('femme');
}

// Close Booking Modal
function closeBooking() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    resetBookingForm();
}

// Initialize Modal Services
function initializeModalServices(category) {
    const list = document.getElementById('modalServicesList');
    list.innerHTML = '';

    services[category].forEach(service => {
        const option = document.createElement('div');
        option.className = 'service-option';
        option.dataset.name = service.name;
        option.dataset.duration = service.duration;
        option.dataset.price = service.price;
        
        option.innerHTML = `
            <h4>${service.name}</h4>
            <div class="service-option-info">
                <span><i class="fas fa-clock"></i> ${service.duration}</span>
                <span><i class="fas fa-euro-sign"></i> ${service.price} €</span>
            </div>
        `;
        
        option.addEventListener('click', () => {
            document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            
            selectedService = {
                name: service.name,
                duration: service.duration,
                price: service.price
            };
            
            document.querySelector('.btn-next').disabled = false;
        });
        
        list.appendChild(option);
    });

    // Category buttons in modal
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            initializeModalServices(btn.dataset.cat);
        });
    });
}

// Update Step Display
function updateStepDisplay() {
    // Update step indicators
    document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        if (stepNum <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update step content
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`step${currentStep}`).classList.add('active');

    // Special handling for step 2
    if (currentStep === 2) {
        updateSelectedServiceInfo();
        initializeCalendar();
    }

    // Special handling for step 4
    if (currentStep === 4) {
        updateBookingRecap();
    }
}

// Next Step
function nextStep() {
    if (currentStep === 1 && !selectedService) {
        alert('Veuillez sélectionner une coiffure');
        return;
    }

    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
        alert('Veuillez sélectionner une date et une heure');
        return;
    }

    if (currentStep === 3) {
        if (!validateContactForm()) {
            return;
        }
    }

    currentStep++;
    updateStepDisplay();
}

// Previous Step
function prevStep() {
    currentStep--;
    updateStepDisplay();
}

// Update Selected Service Info
function updateSelectedServiceInfo() {
    if (selectedService) {
        document.getElementById('selectedServiceName').textContent = selectedService.name;
        document.getElementById('selectedServiceDuration').textContent = selectedService.duration;
        document.getElementById('selectedServicePrice').textContent = selectedService.price + ' €';
    }
}

// Initialize Calendar
function initializeCalendar() {
    updateCalendarDisplay();
    generateTimeSlots();
}

// Update Calendar Display
function updateCalendarDisplay() {
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
    document.getElementById('calendarMonth').textContent = 
        `${monthNames[currentMonth]} ${currentYear}`;
    
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    // Add day headers
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.style.textAlign = 'center';
        dayHeader.style.fontWeight = '600';
        dayHeader.style.padding = '0.5rem';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });

    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        calendar.appendChild(emptyDay);
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const dayDate = new Date(currentYear, currentMonth, day);
        dayDate.setHours(0, 0, 0, 0);
        
        // Disable past dates and Sundays/Mondays (closed days)
        const dayOfWeek = dayDate.getDay();
        if (dayDate < today || dayOfWeek === 0 || dayOfWeek === 1) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', () => {
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                dayElement.classList.add('selected');
                selectedDate = new Date(currentYear, currentMonth, day);
                document.getElementById('btnStep2').disabled = !selectedTime;
            });
        }
        
        calendar.appendChild(dayElement);
    }
}

// Previous Month
function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendarDisplay();
}

// Next Month
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendarDisplay();
}

// Generate Time Slots
function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    timeSlotsContainer.innerHTML = '';

    const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    times.forEach(time => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.textContent = time;
        
        slot.addEventListener('click', () => {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedTime = time;
            document.getElementById('btnStep2').disabled = !selectedDate;
        });
        
        timeSlotsContainer.appendChild(slot);
    });
}

// Validate Contact Form
function validateContactForm() {
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();

    if (!name || !email || !phone) {
        alert('Veuillez remplir tous les champs obligatoires');
        return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Veuillez entrer une adresse email valide');
        return false;
    }

    return true;
}

// Update Booking Recap
function updateBookingRecap() {
    document.getElementById('recapService').textContent = selectedService.name;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('recapDate').textContent = selectedDate.toLocaleDateString('fr-FR', options);
    
    document.getElementById('recapTime').textContent = selectedTime;
    document.getElementById('recapDuration').textContent = selectedService.duration;
    document.getElementById('recapPrice').textContent = selectedService.price + ' €';
    
    const remaining = selectedService.price - 10;
    document.getElementById('recapRemaining').textContent = remaining + ' €';
}

// Confirm Booking
function confirmBooking() {
    // Validate payment form
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value.trim();
    const cardCvv = document.getElementById('cardCvv').value.trim();
    const cardName = document.getElementById('cardName').value.trim();

    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        alert('Veuillez remplir toutes les informations de paiement');
        return;
    }

    // Basic validation
    if (cardNumber.replace(/\s/g, '').length < 13) {
        alert('Numéro de carte invalide');
        return;
    }

    if (cardCvv.length < 3) {
        alert('CVV invalide');
        return;
    }

    // Show loading state
    const confirmBtn = document.querySelector('.btn-confirm');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
    confirmBtn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        showConfirmation();
        sendConfirmationEmail();
    }, 2000);
}

// Show Confirmation
function showConfirmation() {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(content => {
        content.style.display = 'none';
    });

    // Show confirmation
    const confirmation = document.getElementById('confirmation');
    confirmation.style.display = 'block';

    // Fill confirmation details
    document.getElementById('confirmService').textContent = selectedService.name;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('confirmDate').textContent = selectedDate.toLocaleDateString('fr-FR', options);
    
    document.getElementById('confirmTime').textContent = selectedTime;
    document.getElementById('confirmName').textContent = document.getElementById('customerName').value;
}

// Send Confirmation Email (simulated)
function sendConfirmationEmail() {
    const email = document.getElementById('customerEmail').value;
    const name = document.getElementById('customerName').value;
    
    console.log('Email de confirmation envoyé à:', email);
    console.log('Détails de la réservation:', {
        client: name,
        service: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        price: selectedService.price,
        deposit: 10
    });
    
    // In a real application, this would send an actual email via backend
}

// Reset Booking Form
function resetBookingForm() {
    currentStep = 1;
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    
    // Reset all forms
    document.getElementById('bookingForm').reset();
    document.getElementById('paymentForm').reset();
    
    // Reset selections
    document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    
    // Reset confirmation display
    document.querySelectorAll('.step-content').forEach(content => {
        content.style.display = '';
    });
    document.getElementById('confirmation').style.display = 'none';
    
    // Re-initialize
    updateStepDisplay();
}
