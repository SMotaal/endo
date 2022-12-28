import { assert, makeAssert, fail, details, error } from "../../src/error/assert.js"

{
    const { error, details, fail, ...rest } = assert;

    assert.details`foo`;
    assert.fail('foo',);
    assert(false);
}

{
    const assert1 = makeAssert();

    {
        const { error, details, fail, ...rest } = assert1;

        assert1.details`foo`;
        assert1.fail('foo',);
        assert1(false);
    }

    {
        const assert2 = assert1.makeAssert()

        {
            const { error, details, fail, ...rest } = assert2;

            assert2.details`foo`;
            assert2.fail('foo');
            assert2(false);
        }
    }
}