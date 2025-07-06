import { AllowedFileExtensions } from "@lichtblick/suite-base/constants/allowedFileExtensions";
import { IDataSourceFactory, DataSourceFactoryInitializeArgs } from "@lichtblick/suite-base/context/PlayerSelectionContext";
import { Player } from "@lichtblick/suite-base/players/types";
declare class Ros2LocalBagDataSourceFactory implements IDataSourceFactory {
    id: string;
    type: IDataSourceFactory["type"];
    displayName: string;
    iconName: IDataSourceFactory["iconName"];
    supportedFileTypes: AllowedFileExtensions[];
    supportsMultiFile: boolean;
    initialize(args: DataSourceFactoryInitializeArgs): Player | undefined;
}
export default Ros2LocalBagDataSourceFactory;
