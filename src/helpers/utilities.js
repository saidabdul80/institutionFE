
export const helpers = {
  isImageFile(fileType) {
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png']

    return validImageTypes.includes(fileType)
  },
  addClass(el, className) {
    if (el.classList) el.classList.add(className)
    else el.className += ' ' + className
  },
  hasClass(el, className) {
    const hasClass = el.classList
      ? el.classList.contains(className)
      : new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)

    return hasClass
  },

  getLastEditedMessage(timestamp) {
    const timestampDate = new Date(timestamp);
    const currentDate = new Date();
    const timeDifference = currentDate - timestampDate;
  
    const secondsAgo = Math.floor(timeDifference / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
  
    if (minutesAgo < 1) {
      return `Last edited ${secondsAgo} seconds ago`;
    } else if (hoursAgo < 1) {
      return `Last edited ${minutesAgo} minutes ago`;
    } else {
      return `Last edited ${hoursAgo} hours ago`;
    }
  },
  

  formatMoney(amount, sign = "₦", currency = 0) {
    if (!currency) {
      currency = {
        precision: 2,
        thousand_separator: ',',
        decimal_separator: '.',
        symbol: sign,
      }
    }

    let {
      precision,
      decimal_separator,
      thousand_separator,
      symbol,
      swap_currency_symbol,
    } = currency

    try {
      precision = Math.abs(precision)
      precision = isNaN(precision) ? 2 : precision

      const negativeSign = amount < 0 ? '-' : ''

      let i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(precision))
      ).toString()
      let j = i.length > 3 ? i.length % 3 : 0

      let moneySymbol = `${symbol}`
      let thousandText = j ? i.substr(0, j) + thousand_separator : ''
      let amountText = i
        .substr(j)
        .replace(/(\d{3})(?=\d)/g, '$1' + thousand_separator)
      let precisionText = precision
        ? decimal_separator +
        Math.abs(amount - i)
          .toFixed(precision)
          .slice(2)
        : ''
      let combinedAmountText =
        negativeSign + thousandText + amountText + precisionText

      return swap_currency_symbol
        ? combinedAmountText + ' ' + moneySymbol
        : moneySymbol + ' ' + combinedAmountText
    } catch (e) {
      console.error(e)
    }
  },
  
  // Merge two objects but only existing properties
  mergeSettings(target, source) {
    Object.keys(source).forEach(function (key) {
      if (key in target) {
        // or target.hasOwnProperty(key)
        target[key] = source[key]
      }
    })
  },

  checkValidUrl(url) {
    if (
      url.includes('http://localhost') ||
      url.includes('http://127.0.0.1') ||
      url.includes('https://localhost') ||
      url.includes('https://127.0.0.1')
    ) {
      return true
    }
    let pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
      'i'
    ) // fragment locator

    return !!pattern.test(url)
  },

  checkValidDomainUrl(url) {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      return true
    }

    let pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
      'i'
    ) // fragment locator

    return !!pattern.test(url)
  },

  fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea')
    textArea.value = text
    // Avoid scrolling to bottom
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      var successful = document.execCommand('copy')
      var msg = successful ? 'successful' : 'unsuccessful'
      console.log('Fallback: Copying text command was ' + msg)
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err)
    }
    document.body.removeChild(textArea)
  },
  copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(text)
      return
    }
    navigator.clipboard.writeText(text).then(
      function () {
        return true
      },
      function (err) {
        return false
      }
    )
  },
  arrayDifference(array1, array2) {
    return array1?.filter((i) => {
      return array2?.indexOf(i) < 0
    })
  },
  getBadgeStatusColor(status) {
    switch (status) {
      case 'DRAFT':
        return {
          bgColor: '#F8EDCB',
          color: '#744210',
        }
      case 'PAID':
        return {
          bgColor: '#D5EED0',
          color: '#276749',
        }
      case 'UNPAID':
        return {
          bgColor: '#F8EDC',
          color: '#744210',
        }
      case 'SENT':
        return {
          bgColor: 'rgba(246, 208, 154, 0.4)',
          color: '#975a16',
        }
      case 'REJECTED':
        return {
          bgColor: '#E1E0EA',
          color: '#1A1841',
        }
      case 'ACCEPTED':
        return {
          bgColor: '#D5EED0',
          color: '#276749',
        }
      case 'VIEWED':
        return {
          bgColor: '#C9E3EC',
          color: '#2c5282',
        }
      case 'EXPIRED':
        return {
          bgColor: '#FED7D7',
          color: '#c53030',
        }
      case 'PARTIALLY PAID':
        return {
          bgColor: '#C9E3EC',
          color: '#2c5282',
        }
      case 'COMPLETED':
        return {
          bgColor: '#D5EED0',
          color: '#276749',
        }
      case 'DUE':
        return {
          bgColor: '#F8EDCB',
          color: '#744210',
        }
      case 'YES':
        return {
          bgColor: '#D5EED0',
          color: '#276749',
        }
      case 'NO':
        return {
          bgColor: '#FED7D7',
          color: '#c53030',
        }
    }
  },

  toFormData(object) {
    const formData = new FormData()

    Object.keys(object).forEach((key) => {
      if (Array.isArray(object[key])) {
        formData.append(key, JSON.stringify(object[key]))
      } else {
        // Convert null to empty strings (because formData does not support null values and converts it to string)
        if (object[key] === null) {
          object[key] = ''
        }

        formData.append(key, object[key])
      }
    })

    return formData
  },

}
