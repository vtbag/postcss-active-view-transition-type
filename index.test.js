const postcss = require('postcss')
const { equal } = require('node:assert')
const { test } = require('node:test')

const plugin = require('./')

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  equal(result.css, output)
  equal(result.warnings().length, 0)
}

/* Write tests  */

test('rewrite single type', async () => {
  await run(':active-view-transition-type(x){ }', ':root.x{ }', { })
})
test('rewrite two type', async () => {
  await run(':active-view-transition-type(x, y){ }', ':root:is(.x, .y){ }', { })
})
test('rewrite single type with whitespace', async () => {
  await run(':active-view-transition-type(  x     ){ }', ':root.x{ }', { })
})
test('rewrite two type with whitespace', async () => {
  await run(':active-view-transition-type( x , /* important */ y){ }', ':root:is(.x, .y){ }', { })
})
test('complex selector', async () => {
  await run(':active-view-transition, :active-view-transition-type(root)   ::view-transition { }', ':active-view-transition, :root.root   ::view-transition { }', { })
})

test('garbage in, garbage out', async () => {
  await run(':active-view-transition-type(x, y) :root { }', ':root:is(.x, .y) :root { }', { })
})


