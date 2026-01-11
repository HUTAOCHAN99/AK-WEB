import {
  FaCampground,
  FaUsers,
  FaBook,
  FaLaptopCode,
  FaPray,
  FaGraduationCap,
  FaCalendar,
  FaHandsHelping,
  FaChalkboardTeacher,
  FaMicrophone,
  FaMusic,
  FaFilm,
  FaGamepad,
  FaTree,
  FaRunning,
  FaUtensils,
  FaHeart,
  FaGlobe,
  FaCode,
  FaPalette,
  FaBullhorn,
  FaUsersCog,
  FaMedal
} from 'react-icons/fa'
import React from 'react'

// Type untuk icon component
export type IconComponentType = React.ComponentType<{ className?: string }>

export const iconMap: Record<string, IconComponentType> = {
  FaCampground,
  FaUsers,
  FaBook,
  FaLaptopCode,
  FaPray,
  FaGraduationCap,
  FaCalendar,
  FaHandsHelping,
  FaChalkboardTeacher,
  FaMicrophone,
  FaMusic,
  FaFilm,
  FaGamepad,
  FaTree,
  FaRunning,
  FaUtensils,
  FaHeart,
  FaGlobe,
  FaCode,
  FaPalette,
  FaBullhorn,
  FaUsersCog,
  FaMedal
}

export const AVAILABLE_ICONS = Object.keys(iconMap)

// Helper function to get icon component
export const getIconComponent = (iconName?: string): React.ReactNode => {
  if (!iconName) return null
  const IconComponent = iconMap[iconName]
  if (!IconComponent) return null
  return React.createElement(IconComponent, { className: "text-2xl" })
}