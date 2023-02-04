import { Cog6ToothIcon } from "@heroicons/react/24/outline"

export const SettingsView: React.FC = () => {
  return (
    <button className="absolute bottom-4 right-4 bg-transparent p-2 text-black hover:animate-spin hover:bg-transparent dark:text-gray-200">
      <Cog6ToothIcon className="h-6 w-6" />
    </button>
  )
}
