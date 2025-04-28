<!-- src/components/form/CurrencyInput.vue -->
<template>
  <v-text-field
      v-model="displayValue"
      v-bind="attrs"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      @keydown="onKeyDown"
      @input="onInput"
      @blur="onBlur"
  />
</template>

<script setup lang="ts">
import {ref, watch, useAttrs} from 'vue'

// Define only our custom props
const props = defineProps<{
  modelValue: number | null
  decimal?: 'comma' | 'dot'
  allowDecimals?: boolean
}>()

// Emit the numeric value back to the parent
const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

// Capture and pass through all other <v-text-field> props
const attrs = useAttrs()

// Internal display value (formatted string)
const displayValue = ref('')

// Default prop values
const decimal = props.decimal ?? 'comma'
const allowDecimals = props.allowDecimals ?? true

// Format number to string (1.000,00 or 1,000.00)
function format(value: number | null): string {
  if (value == null) return ''

  const hasDecimals = value % 1 !== 0

  return new Intl.NumberFormat(
      decimal === 'dot' ? 'en-US' : 'de-DE',
      {
        minimumFractionDigits: hasDecimals && allowDecimals ? 2 : 0,
        maximumFractionDigits: allowDecimals ? 2 : 0
      }
  ).format(value)
}

// Parse user input string to number
function parse(value: string): number | null {
  const sanitized = value
      .replace(/\s/g, '')
      .replace(decimal === 'comma' ? /\./g : /,/g, '') // remove 1.000
      .replace(decimal === 'comma' ? /,/g : /\./g, '.') // 1.000,00 → 1000.00

  const number = parseFloat(sanitized)
  return isNaN(number) ? null : number
}

// Initial sync: modelValue → display
watch(() => props.modelValue, (val) => {
  displayValue.value = format(val)
}, {immediate: true})

// Key restriction handler
function onKeyDown(e: KeyboardEvent) {
  const decimalChar = decimal === 'comma' ? ',' : '.'

  const isAllowed = [
    'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight',
    ...Array.from({length: 10}, (_, i) => `${i}`)
  ]

  if (allowDecimals) isAllowed.push(decimalChar)

  if (!isAllowed.includes(e.key)) {
    e.preventDefault()
  }
}

// Input handler (while typing)
function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  displayValue.value = val
  emit('update:modelValue', parse(val))
}

// Format final value on blur
function onBlur() {
  displayValue.value = format(parse(displayValue.value))
}
</script>