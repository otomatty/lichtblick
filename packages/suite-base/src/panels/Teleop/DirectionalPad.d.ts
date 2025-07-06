/// <reference types="react" />
export declare enum DirectionalPadAction {
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3
}
type DirectionalPadProps = {
    disabled?: boolean;
    onAction?: (action?: DirectionalPadAction) => void;
};
declare function DirectionalPad(props: DirectionalPadProps): React.JSX.Element;
export default DirectionalPad;
