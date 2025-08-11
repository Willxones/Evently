import { Text } from '../catalyst/text'
import { Navbar, NavbarSection } from '../catalyst/navbar'
import { useState } from 'react'
import { HomeIcon, UsersIcon, UserIcon } from '@heroicons/react/24/outline'
import { CalendarIcon } from '@heroicons/react/24/outline'
import Blob from '../../assets/Blob.png'

const navItems = [
    { name: 'Dashboard', label: 'Dashboard', Icon: HomeIcon },
    { name: 'Events', label: 'Events', Icon: CalendarIcon },
    { name: 'Community', label: 'Community', Icon: UsersIcon },
    { name: 'Profile', label: 'Profile', Icon: UserIcon },
]

export const MobileDashboardHeader = () => {
    const [selected, setSelected] = useState('Dashboard')

    return (
        <header>
            <Navbar className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[95%] max-w-md mx-auto bg-white h-24 rounded-3xl shadow-lg flex items-center">
                <NavbarSection className="flex w-full items-center justify-around">
                    {navItems.map(({ name, label, Icon }) => (
                        <div
                            key={name}
                            onClick={() => setSelected(name)}
                            className="flex flex-col items-center justify-center gap-1 cursor-pointer w-24"
                        >
                            <div className="relative h-12 w-40 flex items-center justify-center">
                                {selected === name && (
                                    <img src={Blob} alt={`${name} icon`} className="absolute inset-0 ml-1 z-0 w-96" />
                                )}
                                <Icon className="relative z-10 h-7 w-7" />
                            </div>
                            <Text className={`text-sm ${selected === name ? 'font-bold' : 'text-gray-500'}`}>{label}</Text>
                        </div>
                    ))}
                </NavbarSection>
            </Navbar>
        </header>
    )
}