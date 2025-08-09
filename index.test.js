const postcss = require('postcss')
const { equal } = require('node:assert')
const { test } = require('node:test')

const plugin = require('./')

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  equal(result.css, output)
  equal(result.warnings().length, 0)
}


test('rewrite single type', async () => {
  await run(':active-view-transition-type(x){ }', ':root:where(.vtbag-vtt-x){ }', { })
})

test('rewrite two type', async () => {
  await run(':active-view-transition-type(x, y){ }', ':root:where(.vtbag-vtt-x, .vtbag-vtt-y){ }', { })
})

test('rewrite single type with whitespace', async () => {
  await run(':active-view-transition-type(  x     ){ }', ':root:where(.vtbag-vtt-x){ }', { })
})

test('rewrite two type with whitespace', async () => {
  await run(':active-view-transition-type( x , /* important */ y){ }', ':root:where(.vtbag-vtt-x, .vtbag-vtt-y){ }', { })
})

test('complex selector', async () => {
  await run(':active-view-transition, :active-view-transition-type(root)   ::view-transition { }', ':root:where(.vtbag-vtt-0), :root:where(.vtbag-vtt-root)   ::view-transition { }', { })
})

test('garbage in, garbage out', async () => {
  await run(':active-view-transition-type(x, y) :root { }', ':root:where(.vtbag-vtt-x, .vtbag-vtt-y) :root { }', { })
})

test('rewrite :active-view-transition', async () => {
  await run(
    ':active-view-transition-type(x) :active-view-transition :active-view-transition-type(y){ }', 
    ':root:where(.vtbag-vtt-x) :root:where(.vtbag-vtt-0) :root:where(.vtbag-vtt-y){ }', { })
})

test('rewrite nested', async () => {
  await run(
    ':active-view-transition-type(x) { &:active-view-transition-type(y) { } }', 
    ':root:where(.vtbag-vtt-x) { &:root:where(.vtbag-vtt-y) { } }', { })
})

test('rewrite nested (add)', async () => {
  await run(
    'foo { } :active-view-transition-type(x) { &:active-view-transition-type(y) { } }', 
    'foo { } :active-view-transition-type(x) { &:active-view-transition-type(y) { } } /*vtbag*/:root:where(.vtbag-vtt-x) { &/*vtbag*/:root:where(.vtbag-vtt-y) { } }', { mode: 'append'})
})

test('no append (add)', async () => {
  await run(
    ':passive-view-transition-type(x) { &:passive-view-transition-type(y) { } }', 
    ':passive-view-transition-type(x) { &:passive-view-transition-type(y) { } }', { mode: 'append'})
})

test('no append (add)', async () => {
  await run(
    ':active-view-transition-type(x) { &:active-view-transition-type(y) { } } /*vtbag*/:root:where(.vtbag-vtt-x) { &/*vtbag*/:root:where(.vtbag-vtt-y) { } }', 
    ':active-view-transition-type(x) { &:active-view-transition-type(y) { } } /*vtbag*/:root:where(.vtbag-vtt-x) { &/*vtbag*/:root:where(.vtbag-vtt-y) { } }', { mode: 'append'})
})