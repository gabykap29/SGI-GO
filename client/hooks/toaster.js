import { toast } from "sonner";

const handleSuccess = (message) => {
    toast.success(message, {
        duration: 3000,
    })
}

const handleError = (message) => {
    toast.error(message, {
        duration: 3000,
    })
}

export {handleSuccess, handleError}