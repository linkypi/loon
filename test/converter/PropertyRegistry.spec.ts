import "../TestHelper";
import {expect} from "chai";
import {ObjectProperty} from "../../src/converter/decorator/ObjectProperty";
import {PropertyRegistry} from "../../src/converter/PropertyRegistry";
import {IConverter} from "../../src/converter/interface/IConverter";


describe("PropertyRegistry", () => {

    class ATestConverter {

    }

    class JsonPropertyRegistryTestClass {

        @ObjectProperty()
        private name: string;

        @ObjectProperty("created_at")
        private createdAt: Date;

        @ObjectProperty({name: "updated_at"})
        private updatedAt: Date;

        @ObjectProperty({converter: ATestConverter})
        private converter: string;

        @ObjectProperty({name: "is_flag", converter: ATestConverter})
        private isFlag: boolean;
    }

    it('should register json property', () => {

        assertProperty({
            klassProperty: 'name',
            objectProperty: 'name',
            propertyType: String
        });
    });

    it('should register json property with different name', () => {

        assertProperty({
            klassProperty: 'createdAt',
            objectProperty: 'created_at',
            propertyType: Date
        });
    });

    it('should register json property with name options', () => {

        assertProperty({
            klassProperty: 'updatedAt',
            objectProperty: 'updated_at',
            propertyType: Date
        });
    });

    it('should register property with converter options', () => {

        assertProperty({
            klassProperty: 'converter',
            objectProperty: 'converter',
            propertyType: String,
            converter: ATestConverter
        });
    });

    it('should register property with name and converter options', () => {

        assertProperty({
            klassProperty: 'isFlag',
            objectProperty: 'is_flag',
            propertyType: Boolean,
            converter: ATestConverter
        });
    });


    interface PropertyAssertResult {
        klassProperty: string;
        objectProperty: string;
        propertyType: Function;
        converter?: IConverter;
    }

    function assertProperty(result: PropertyAssertResult) {

        const objectProperties: any = PropertyRegistry.objectProperties.get(JsonPropertyRegistryTestClass);

        expect(objectProperties).not.to.be.undefined;

        const klassProperties: any = PropertyRegistry.klassProperties.get(JsonPropertyRegistryTestClass);

        expect(klassProperties).not.to.be.undefined;

        const objectMetadata = objectProperties.get(result.objectProperty);
        const klassMetadata = klassProperties.get(result.klassProperty);

        expect(objectMetadata === klassMetadata).to.be.true;

        expect(objectMetadata.klassProperty).to.be.equal(result.klassProperty);
        expect(objectMetadata.objectProperty).to.be.equal(result.objectProperty);
        expect(objectMetadata.propertyType).to.be.equal(result.propertyType);

        if (typeof result.converter !== 'undefined') {
            expect(objectMetadata.converter).to.be.equal(result.converter);
        }
    }
});

