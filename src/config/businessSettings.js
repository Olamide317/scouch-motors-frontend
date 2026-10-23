const businessSettings = {
  companyName: "Scouch Motors Ltd",

  socialMedia: {
    facebook: {
      enabled: false,
      url: "",
    },
    instagram: {
      enabled: false,
      url: "",
    },
    twitter: {
      enabled: false,
      url: "",
    },
  },

  contact: {
    phone: "+234 803 547 0559",
    phoneNumbers: ["+234 803 547 0559", "+234 (0) 803 261 1750"],
    whatsapp: "2348035470559",
    email: "info@scouchlimited.com",
  },

  location: {
    address: "15 Ezimgbu Link Road (Mommy B Road) GRA Phase 4 Portharcourt",
  },

  openingHours: [
    {
      label: "Monday – Friday",
      hours: "10:00am – 4:00pm GMT",
    },
    {
      label: "Saturday",
      hours: "9:00am – 5:00pm GMT",
    },
  ],
};

export const getWhatsAppUrl = (
  message = "Hello Scouch Motors, I'd like to make an enquiry.",
) => {
  const number = businessSettings.contact.whatsapp.replace(/\D/g, "");

  const baseUrl = `https://wa.me/${number}`;

  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};

export const getPhoneUrl = (phone) => {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("2340")) {
    cleaned = `234${cleaned.slice(4)}`;
  }

  return `tel:+${cleaned}`;
};

export default businessSettings;
