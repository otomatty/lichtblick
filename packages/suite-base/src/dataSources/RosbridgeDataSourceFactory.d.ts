import { IDataSourceFactory, DataSourceFactoryInitializeArgs } from "@lichtblick/suite-base/context/PlayerSelectionContext";
import { Player } from "@lichtblick/suite-base/players/types";
declare class RosbridgeDataSourceFactory implements IDataSourceFactory {
    id: string;
    type: IDataSourceFactory["type"];
    displayName: string;
    iconName: IDataSourceFactory["iconName"];
    docsLinks: {
        url: string;
    }[];
    description: string;
    formConfig: {
        fields: {
            id: string;
            label: string;
            defaultValue: string;
            validate: (newValue: string) => Error | undefined;
        }[];
    };
    initialize(args: DataSourceFactoryInitializeArgs): Player | undefined;
}
export default RosbridgeDataSourceFactory;
