export async function queryProse(): Promise<any> {
  return request('/prose')
}
