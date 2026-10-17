import whatsappIcon from "../assets/icons/whatsapp.svg";

const WHATSAPP_NUMBER = "";

function WhatsAppButton() {
  const hasWhatsAppNumber = WHATSAPP_NUMBER.trim() !== "";

  const whatsappLink = hasWhatsAppNumber
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hello Scouch Motors, I'd like to make an enquiry."
      )}`
    : "#contact";

  return (
    <a
      href={whatsappLink}
      target={hasWhatsAppNumber ? "_blank" : undefined}
      rel={hasWhatsAppNumber ? "noopener noreferrer" : undefined}
      aria-label="Contact Scouch Motors"
      className="
        fixed
        bottom-6
        right-6
        z-50
        flex
        h-[56px]
        w-[56px]
        items-center
        justify-center
        rounded-full
        bg-secondary
        shadow-md
        transition-all
        duration-300
        hover:scale-110
        hover:shadow-lg
        md:bottom-8
        md:right-8
      "
    >
      <img
        src={whatsappIcon}
        alt=""
        className="h-[28px] w-[28px] object-contain brightness-0 invert"
      />
    </a>
  );
}

export default WhatsAppButton;