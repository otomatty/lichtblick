/// <reference types="jest" />
import { ILayoutManager } from "@lichtblick/suite-base/services/ILayoutManager";
export default class MockLayoutManager implements ILayoutManager {
    supportsSharing: boolean;
    isBusy: boolean;
    isOnline: boolean;
    error: Error | undefined;
    on: jest.Mock<any, any, any>;
    off: jest.Mock<any, any, any>;
    setError: jest.Mock<any, any, any>;
    setOnline: jest.Mock<any, any, any>;
    getLayouts: jest.Mock<any, any, any>;
    getLayout: jest.Mock<any, any, any>;
    saveNewLayout: jest.Mock<any, any, any>;
    updateLayout: jest.Mock<any, any, any>;
    deleteLayout: jest.Mock<any, any, any>;
    overwriteLayout: jest.Mock<any, any, any>;
    revertLayout: jest.Mock<any, any, any>;
    makePersonalCopy: jest.Mock<any, any, any>;
    syncWithRemote: jest.Mock<any, any, any>;
}
