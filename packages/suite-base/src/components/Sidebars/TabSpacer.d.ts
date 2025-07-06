/// <reference types="react" />
/**
 * TabSpacer component fills space between <Tab> elements in a <Tabs> component
 *
 * We cannot use a <div> as a child of a Mui <Tabs> component because the <Tabs> component adds mui
 * specific properties to child elements (i.e. fullWidth, etc). This causes react console errors
 * when a <div> is used as a child since the div dom element does not have such properties.
 *
 * This component acts as a stand-in so the Tabs component can add the props and they are ignored.
 */
export declare function TabSpacer(): React.JSX.Element;
