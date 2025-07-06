import { jsx as _jsx } from "react/jsx-runtime";
import WssErrorModal from "./WssErrorModal";
export default {
    title: "components/WssErrorModal",
    component: WssErrorModal,
    parameters: {
        colorScheme: "light",
    },
};
export const Default = {
    render: () => {
        return (_jsx(WssErrorModal, { playerAlerts: [{ severity: "error", message: "Insecure WebSocket connection" }] }));
    },
};
