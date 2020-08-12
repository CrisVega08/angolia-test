export const BASE_QUERIES = [{
  indexName: 'dev_Kavak',
  query: '',
  facets: ['*'],
  // facets: ['car_make', 'car_model', 'car_year', 'final_price', 'km', 'region_name', 'body_type', 'ext_color', 'filter_status', 'location_filter', 'promotion_name', 'transmission', 'fuel_type', 'passengers']
}, {
  indexName: 'dev_qs',
  query: '',
}];

export const ORDER_BY_OPTIONS = [
  { label: 'Ordenar', labelDesktop: 'Ordenar', value: 'dev_Kavak' },
  {
    label: 'Precio (menor a mayor)',
    labelDesktop: '- Precio',
    value: 'dev_price_asc'
  },
  {
    label: 'Precio (mayor a menor)',
    labelDesktop: '+ Precio',
    value: 'dev_price_desc'
  },
  {
    label: 'Año (nuevo a viejo)',
    labelDesktop: '+ Año',
    value: 'dev_years_desc'
  },
  {
    label: 'Año (viejo a nuevo)',
    labelDesktop: '- Año',
    value: 'dev_years_asc'
  },
  {
    label: 'Km (menor a mayor)',
    labelDesktop: '- Kilometraje',
    value: 'dev_km_asc'
  },
  {
    label: 'Km (mayor a menor)',
    labelDesktop: '+ Kilometraje',
    value: 'dev_km_desc'
  },
  {
    label: 'Rendimiento de gasolina (mayor a menor)',
    labelDesktop: '+ Rendimiento',
    value: 'dev_avfc_asc'
  },
  {
    label: 'Caballos de fuerza (mayor a menor)',
    labelDesktop: '+ Potencia',
    value: 'dev_Hp_asc'
  }
];
