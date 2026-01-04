import { FaArrowUp } from 'react-icons/fa'

export default function BackToTop() {
  return (
    <div id="backtop" className="fixed bottom-8 right-8 z-50 opacity-0 invisible transition-all duration-300">
      <a href="#home" id="backtop-link" className="bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg inline-flex items-center justify-center transition duration-300">
        <FaArrowUp className="text-xl" />
      </a>
    </div>
  )
}