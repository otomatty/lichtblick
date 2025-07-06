import { IDataSourceFactory, DataSourceFactoryInitializeArgs } from "@lichtblick/suite-base/context/PlayerSelectionContext";
import { Player } from "@lichtblick/suite-base/players/types";
declare class VelodyneDataSourceFactory implements IDataSourceFactory {
    id: string;
    type: IDataSourceFactory["type"];
    displayName: string;
    iconName: IDataSourceFactory["iconName"];
    description: string;
    docsLinks: {
        url: string;
    }[];
    formConfig: {
        fields: {
            id: string;
            label: string;
            defaultValue: string;
        }[];
    };
    initialize(args: DataSourceFactoryInitializeArgs): Player | undefined;
}
export default VelodyneDataSourceFactory;
