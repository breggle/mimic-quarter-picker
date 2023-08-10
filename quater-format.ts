import dayjs,{ PluginFunc } from 'dayjs'

export const quarterFromMonth = (month: number) => { // start from 0
  return ((month + 1) % 4) + Math.floor((month + 1) / 4) * 2 - 1
}

const QUARTER_STR = ['一', '二', '三', '四']
export const dayjsQuarterFormat: PluginFunc = (_, dayjsClass) => {
  const oldFormat = dayjsClass.prototype.format
  dayjsClass.prototype.format = function(template?: string) {
    const result = oldFormat.bind(this)(template)
    return result.replace('q', () => {
      return QUARTER_STR[quarterFromMonth(this.$M)]
    })
  }
}

const FORMAT = 'YYYY-MM-DD'
export const getQuarterDate = (date: string | string[]) => {
  if (typeof date === 'string') date = [date].filter(Boolean)
  if (date?.length) {
    let [v, vv] = date
    for (let i = 0; i < date.length; i++) {
      let day = dayjs(date[i])
      let month = day.month()
      day = day.set('month', quarterFromMonth(month) * 3)
      if (i === 0) v = day.format(FORMAT)
      else if (i === 1) vv = day.add(3, 'month').subtract(1, 'day').format(FORMAT)
    }
    if (vv) return [v, vv]
    else return v
  } else return date
}
