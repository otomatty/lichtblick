/// <reference types="react" />
import { NotificationMessage } from "@lichtblick/suite-base/util/sendNotification";
export default function NotificationModal({ notification: { details, message, severity, subText }, onRequestClose, }: {
    notification: NotificationMessage;
    onRequestClose?: () => void;
}): React.ReactElement;
