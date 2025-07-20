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
  await run(':active-view-transition-type(x){ }', ':root.vtbag-vtt-x{ }', { })
})

test('rewrite two type', async () => {
  await run(':active-view-transition-type(x, y){ }', ':root:is(.vtbag-vtt-x, .vtbag-vtt-y){ }', { })
})

test('rewrite single type with whitespace', async () => {
  await run(':active-view-transition-type(  x     ){ }', ':root.vtbag-vtt-x{ }', { })
})

test('rewrite two type with whitespace', async () => {
  await run(':active-view-transition-type( x , /* important */ y){ }', ':root:is(.vtbag-vtt-x, .vtbag-vtt-y){ }', { })
})

test('complex selector', async () => {
  await run(':active-view-transition, :active-view-transition-type(root)   ::view-transition { }', ':root.vtbag-vtt-0, :root.vtbag-vtt-root   ::view-transition { }', { })
})

test('garbage in, garbage out', async () => {
  await run(':active-view-transition-type(x, y) :root { }', ':root:is(.vtbag-vtt-x, .vtbag-vtt-y) :root { }', { })
})

test('rewrite :active-view-transition', async () => {
  await run(
    ':active-view-transition-type(x) :active-view-transition :active-view-transition-type(y){ }', 
    ':root.vtbag-vtt-x :root.vtbag-vtt-0 :root.vtbag-vtt-y{ }', { })
})

test('rewrite nested', async () => {
  await run(
    ':active-view-transition-type(x) { &:active-view-transition-type(y) { } }', 
    ':root.vtbag-vtt-x { &:root.vtbag-vtt-y { } }', { })
})

test('rewrite nested (add)', async () => {
  await run(
    ':active-view-transition-type(x) { &:active-view-transition-type(y) { } }', 
    ':active-view-transition-type(x) { &:active-view-transition-type(y) { } } :root.vtbag-vtt-x { &:root.vtbag-vtt-y { } }', { mode: 'append'})
})

test('no append (add)', async () => {
  await run(
    ':passive-view-transition-type(x) { &:passive-view-transition-type(y) { } }', 
    ':passive-view-transition-type(x) { &:passive-view-transition-type(y) { } }', { mode: 'append'})
})