suite('About page tests', function() {
    test('page should contain a contact link', function () {
        assert($('a[href="/contact"]').length);
    });
});