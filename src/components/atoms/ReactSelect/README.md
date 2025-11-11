# ReactSelect Component

Un wrapper personalizado de `react-select` que mantiene la consistencia visual con el sistema de diseño de DaisyUI.

## Características

- **Búsqueda integrada**: Todos los selectores incluyen búsqueda por defecto
- **Selección múltiple**: Soporte completo para `isMulti`
- **Estilos consistentes**: Mantiene la apariencia de HeroUI
- **Accesibilidad**: Manejo completo de accesibilidad
- **Carga asíncrona**: Indicadores de carga integrados
- **Mensajes personalizables**: Para estados vacíos y carga

## Uso Básico

### Selector Simple

```tsx
import { ReactSelect, type SelectOption } from '@components/atoms/ReactSelect'

const options: SelectOption[] = [
  { value: '1', label: 'Opción 1' },
  { value: '2', label: 'Opción 2' },
  { value: '3', label: 'Opción 3' }
]

<ReactSelect
  label="Selecciona una opción"
  placeholder="Elige..."
  options={options}
  value={selectedOption}
  onChange={(newValue) => setSelectedOption(newValue as SelectOption | null)}
  isSearchable
  isClearable
/>
```

### Selector Múltiple

```tsx
<ReactSelect
  label="Selecciona múltiples opciones"
  placeholder="Elige varias..."
  options={options}
  value={selectedOptions}
  onChange={(newValues) => setSelectedOptions(newValues as SelectOption[])}
  isMulti
  isSearchable
  isClearable
  closeMenuOnSelect={false}
/>
```

### Con Estados de Error

```tsx
<ReactSelect
  label="Campo requerido"
  placeholder="Selecciona..."
  options={options}
  value={selectedOption}
  onChange={handleChange}
  isRequired
  errorMessage="Este campo es obligatorio"
  isInvalid={hasError}
  variant="bordered"
  color="danger"
/>
```

### Con Descripción

```tsx
<ReactSelect
  label="Configuración avanzada"
  description="Esta opción afecta el comportamiento general del sistema"
  placeholder="Selecciona una configuración..."
  options={options}
  value={selectedOption}
  onChange={handleChange}
  size="lg"
  variant="bordered"
/>
```

## Props

### Props Principales

| Prop           | Tipo                                                                          | Default     | Descripción         |
| -------------- | ----------------------------------------------------------------------------- | ----------- | ------------------- |
| `label`        | `string`                                                                      | -           | Etiqueta del campo  |
| `description`  | `string`                                                                      | -           | Texto de ayuda      |
| `errorMessage` | `string`                                                                      | -           | Mensaje de error    |
| `isRequired`   | `boolean`                                                                     | `false`     | Campo obligatorio   |
| `size`         | `'sm' \| 'md' \| 'lg'`                                                        | `'md'`      | Tamaño del selector |
| `variant`      | `'flat' \| 'bordered' \| 'faded' \| 'underlined'`                             | `'flat'`    | Variante visual     |
| `color`        | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Color del tema      |
| `isInvalid`    | `boolean`                                                                     | `false`     | Estado de error     |

### Props de react-select

| Prop                | Tipo                                     | Default       | Descripción                |
| ------------------- | ---------------------------------------- | ------------- | -------------------------- |
| `options`           | `SelectOption[]`                         | `[]`          | Opciones disponibles       |
| `value`             | `SelectOption \| SelectOption[] \| null` | -             | Valor seleccionado         |
| `onChange`          | `function`                               | -             | Callback de cambio         |
| `placeholder`       | `string`                                 | `'Select...'` | Texto del placeholder      |
| `isDisabled`        | `boolean`                                | `false`       | Campo deshabilitado        |
| `isLoading`         | `boolean`                                | `false`       | Estado de carga            |
| `isMulti`           | `boolean`                                | `false`       | Selección múltiple         |
| `isClearable`       | `boolean`                                | `false`       | Botón de limpiar           |
| `isSearchable`      | `boolean`                                | `true`        | Búsqueda habilitada        |
| `closeMenuOnSelect` | `boolean`                                | `true`        | Cerrar menú al seleccionar |

## Tipos

```tsx
interface SelectOption {
  value: string | number
  label: string
  isDisabled?: boolean
}
```

## Ejemplos de Integración

### En componentes existentes

Los selectores de campaña ya están actualizados:

```tsx
// SingleCampaignSelector
<ReactSelect
  label="Campaign"
  placeholder="Select a campaign"
  options={campaignOptions}
  value={selectedOption}
  onChange={handleChange}
  isLoading={isLoading}
  isSearchable
  isClearable
/>

// MultiCampaignSelector
<ReactSelect
  label="Campaigns"
  placeholder="Select campaigns"
  options={campaignOptions}
  value={selectedOptions}
  onChange={handleChange}
  isMulti
  isSearchable
  closeMenuOnSelect={false}
/>
```

## Migración desde otros UI libraries

### Antes (Generic Select):

```tsx
<Select label="Country" selectedKeys={selectedKeys} onSelectionChange={handleSelectionChange} selectionMode="multiple">
  {countries.map((country) => (
    <SelectItem key={country.id}>{country.name}</SelectItem>
  ))}
</Select>
```

### Después (ReactSelect):

```tsx
<ReactSelect label="Country" options={countryOptions} value={selectedOptions} onChange={handleChange} isMulti />
```

## Ventajas

1. **Búsqueda mejorada**: Filtrado inmediato y eficiente
2. **Mejor UX**: Indicadores visuales claros y transiciones suaves
3. **Performance**: Virtualización para listas grandes
4. **Flexibilidad**: Componentes personalizables y extensibles
5. **Accesibilidad**: Navegación completa por teclado y lectores de pantalla
6. **Consistencia**: Estilos unificados con el sistema de diseño
