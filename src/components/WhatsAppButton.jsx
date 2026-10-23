import whatsappIcon from "../assets/icons/whatsapp.svg";
import { getWhatsAppUrl } from "../config/businessSettings";

function WhatsAppButton() {
  const whatsappLink = getWhatsAppUrl();

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Scouch Motors on WhatsApp"
      title="Chat with us on WhatsApp"
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
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-[#233D4D]
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