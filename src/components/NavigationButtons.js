// Import dependencies and declarations

import { saveUser } from '../data/api';
import { useContext } from 'react';
import { TaskContext } from '../TaskContext';
import { GearFill, DatabaseFillGear } from 'react-bootstrap-icons';
import * as Dialog from '@radix-ui/react-dialog';
import SettingsDialog from './Dialogs/SettingsDialog/SettingsDialog';
import AdminDialog from './Dialogs/AdminDialog/AdminDialog';

/**
 * A component that displays navigation buttons at the bottom right of the users screen.
 * The component includes buttons for accessing the admin panel (given the user has
 * administration permissions), personal profile, and channel settings.
 * @returns {JSX.Element} - The rendered navigation buttons
 */
function NavigationButtons () {

    // Import global user context
    const { user } = useContext(TaskContext);

    /**
     * Save user data to api upon completed change to profile
     * settings (upon closure of settings dialog)
     */
    const handleChange = async () => {
        saveUser(user);
    };

    return (
        <div className="flex flex-column justify-between z-50">
            {/** Render admin management dialog trigger for users with admin permissions */}
            {(Number(user?.isAdmin) || 0) ? (
                <Dialog.Root>
                    <Dialog.Trigger className="py-2 px-2 text-text cursor-pointer hover:text-h1
                            rounded-full fixed bottom-10 right-10
                            shadow-base bg-fg transform transition-transform
                            duration-200 ease-out hover:scale-110 mb-temp2">
                        <DatabaseFillGear />
                    </Dialog.Trigger>
                    <AdminDialog />
                </Dialog.Root>
            ) : null}
            
            {/** Render settings dialog trigger for all users */}
            <Dialog.Root onOpenChange={handleChange}>
                <Dialog.Trigger className="py-2 px-2 text-text cursor-pointer hover:text-h1
                        rounded-full fixed bottom-10 right-10 shadow-base
                        bg-fg transform transition-transform duration-200
                        ease-out hover:scale-110 mb-0">
                    <GearFill />
                </Dialog.Trigger>
                <SettingsDialog />
            </Dialog.Root>
        </div>
    );
}
export default NavigationButtons;