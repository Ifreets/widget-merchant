export interface IConfigWidget {
  /** id của doanh nghiệp */
  id_business?: string
  /** token của doanh nghiệp */
  token_business?: string
}
export type Method = 'POST' | 'GET'

export type TSynchData = (token_business: string) => Promise<void>
