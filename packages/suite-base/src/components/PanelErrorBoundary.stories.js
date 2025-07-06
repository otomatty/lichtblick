import { jsx as _jsx } from "react/jsx-runtime";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { action } from "storybook/actions";
import PanelErrorBoundary from "./PanelErrorBoundary";
function Broken() {
    throw Object.assign(new Error("Hello!"), {
        stack: `
  an error occurred
  it's caught by this component
  now the user sees
      `,
    });
    return ReactNull;
}
export default {
    title: "components/PanelErrorBoundary",
};
export const Default = {
    render: () => {
        return (_jsx(DndProvider, { backend: HTML5Backend, children: _jsx(PanelErrorBoundary, { onRemovePanel: action("onRemovePanel"), onResetPanel: action("onResetPanel"), children: _jsx(Broken, {}) }) }));
    },
};
export const ShowingDetails = {
    render: () => {
        return (_jsx(DndProvider, { backend: HTML5Backend, children: _jsx(PanelErrorBoundary, { showErrorDetails: true, hideErrorSourceLocations: true, onRemovePanel: action("onRemovePanel"), onResetPanel: action("onResetPanel"), children: _jsx(Broken, {}) }) }));
    },
};
