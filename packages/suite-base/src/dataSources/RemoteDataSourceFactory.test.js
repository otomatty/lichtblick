/** @jest-environment jsdom */
import { IterablePlayer, WorkerIterableSource, } from "@lichtblick/suite-base/players/IterablePlayer";
import RemoteDataSourceFactory, { checkExtensionMatch } from "./RemoteDataSourceFactory";
jest.mock("@lichtblick/suite-base/players/IterablePlayer", () => ({
    WorkerIterableSource: jest.fn(),
    IterablePlayer: jest.fn(),
}));
function setupArgs(params) {
    const mockArgs = {
        params,
        metricsCollector: jest.fn(),
    };
    return mockArgs;
}
describe("checkExtensionMatch", () => {
    it("should return the extension if the comparing extension is undefined", () => {
        const mockExtenstion = ".mcap";
        const result = checkExtensionMatch(mockExtenstion);
        expect(result).toBe(mockExtenstion);
    });
    it("should return the extension when the comparator and comparing extensions are equal", () => {
        const mockExtenstion = ".mcap";
        const comparatorExtension = ".mcap";
        const result = checkExtensionMatch(mockExtenstion, comparatorExtension);
        expect(result).toBe(mockExtenstion);
    });
    it("should throw an error if the comparator and comparing extensions are different", () => {
        const mockExtenstion = ".mcap";
        const comparatorExtension = ".bag";
        const result = () => {
            checkExtensionMatch(mockExtenstion, comparatorExtension);
        };
        expect(result).toThrow("All sources need to be from the same type");
    });
});
describe("RemoteDataSourceFactory", () => {
    let factory;
    const mockSource = { mock: "workerSource" };
    WorkerIterableSource.mockImplementation(() => mockSource);
    const mockPlayer = { mock: "playerInstance" };
    IterablePlayer.mockImplementation(() => mockPlayer);
    beforeEach(() => {
        jest.clearAllMocks();
        factory = new RemoteDataSourceFactory();
    });
    it("should initialize and return a player", () => {
        const mockArgs = setupArgs({
            url: "https://example.com/test.mcap",
        });
        const result = factory.initialize(mockArgs);
        expect(WorkerIterableSource).toHaveBeenCalledWith({
            initWorker: expect.any(Function),
            initArgs: { urls: ["https://example.com/test.mcap"] },
        });
        expect(IterablePlayer).toHaveBeenCalledWith({
            source: mockSource,
            name: "https://example.com/test.mcap",
            metricsCollector: mockArgs.metricsCollector,
            urlParams: { urls: ["https://example.com/test.mcap"] },
            sourceId: "remote-file",
        });
        expect(result).toBe(mockPlayer);
    });
    it("should initialize and return a player with multiple files", () => {
        const mockArgs = setupArgs({
            url: "https://example.com/test1.mcap,https://example.com/test2.mcap",
        });
        const result = factory.initialize(mockArgs);
        expect(IterablePlayer).toHaveBeenCalledWith({
            source: mockSource,
            name: mockArgs.params?.url,
            metricsCollector: mockArgs.metricsCollector,
            urlParams: { urls: ["https://example.com/test1.mcap", "https://example.com/test2.mcap"] },
            sourceId: "remote-file",
        });
        expect(result).toBe(mockPlayer);
    });
    it("should return undefined if args.params.url is undefined", () => {
        const mockArgs = setupArgs();
        const result = factory.initialize(mockArgs);
        expect(result).toBeUndefined();
    });
    it("should throw an error if the multiple sources don't have the same file extension", () => {
        const mockArgs = setupArgs({
            url: "https://example.com/test.mcap,https://example.com/test.bag",
        });
        expect(() => factory.initialize(mockArgs)).toThrow("All sources need to be from the same type");
    });
});
