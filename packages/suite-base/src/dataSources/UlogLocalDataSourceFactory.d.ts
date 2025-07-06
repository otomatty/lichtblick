import { AllowedFileExtensions } from "@lichtblick/suite-base/constants/allowedFileExtensions";
import { IDataSourceFactory, DataSourceFactoryInitializeArgs } from "@lichtblick/suite-base/context/PlayerSelectionContext";
import { Player } from "@lichtblick/suite-base/players/types";
declare class UlogLocalDataSourceFactory implements IDataSourceFactory {
    id: string;
    type: IDataSourceFactory["type"];
    displayName: string;
    iconName: IDataSourceFactory["iconName"];
    supportedFileTypes: AllowedFileExtensions[];
    initialize(args: DataSourceFactoryInitializeArgs): Player | undefined;
}
export default UlogLocalDataSourceFactory;
