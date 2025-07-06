import { jsx as _jsx } from "react/jsx-runtime";
import { action } from "storybook/actions";
import DirectionalPad from "./DirectionalPad";
export default {
    title: "panels/Teleop/DirectionalPad",
    component: DirectionalPad,
};
export const Basic = {
    render: () => {
        return _jsx(DirectionalPad, { onAction: action("click") });
    },
};
export const Disabled = {
    render: () => {
        return _jsx(DirectionalPad, { disabled: true, onAction: action("click") });
    },
};
