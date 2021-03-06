import { Api } from 'mapwize'
import {
  lang_cancel,
  lang_description,
  lang_error_required,
  lang_issue_email,
  lang_issue_reported_success,
  lang_issue_type,
  lang_place,
  lang_report_an_issue,
  lang_send,
  lang_summary,
  lang_venue,
} from '../localizor/localizor'
import { replaceColorInBase64svg, titleForLanguage } from '../utils/formatter'
import { bottomViewIcons } from '../utils/icons'

export const buildReportIssuesView = (venue: any, placeDetails: any, userInfo: any, language: string, color: string): HTMLElement => {
  var issueContent: any = {
    owner: venue.owner,
    venueId: venue._id,
    placeId: placeDetails._id,
    reporterEmail: userInfo?.email || '',
  }

  const container = document.createElement('div')
  container.classList.add('mwz-alert-overlay')
  container.onclick = () => {
    container.remove()
  }

  const venueTitle = titleForLanguage(venue, language)
  const placeTitle = titleForLanguage(placeDetails, language)

  const alertContainer = document.createElement('div')
  alertContainer.classList.add('mwz-alert-container')
  alertContainer.onclick = (e) => e.stopPropagation()
  const title = document.createElement('div')
  title.classList.add('mwz-alert-title')
  title.innerHTML = lang_report_an_issue(language)
  alertContainer.appendChild(title)

  container.appendChild(alertContainer)

  const venueTitleRow = buildVenueTitleRow(venueTitle, replaceColorInBase64svg(bottomViewIcons.ISSUE_VENUE, color), language)
  const placeTitleRow = buildPlaceTitleRow(placeTitle, replaceColorInBase64svg(bottomViewIcons.ISSUE_PLACE, color), language)
  const emailRow = buildEmailRow(userInfo, replaceColorInBase64svg(bottomViewIcons.MAIL, color), language, (value: string) => {
    issueContent.reporterEmail = value
  })
  const issuePickerRow = buildIssueTypePickerRow(replaceColorInBase64svg(bottomViewIcons.ISSUE_TYPE, color), placeDetails.issueTypes, language, (value: string) => {
    issueContent.issueTypeId = value
  })
  const summaryRow = buildSummaryRow(replaceColorInBase64svg(bottomViewIcons.ISSUE_SUMMARY, color), language, (value: string) => {
    issueContent.summary = value
  })
  const descriptionRow = buildDescriptionRow(replaceColorInBase64svg(bottomViewIcons.ISSUE_DESCRIPTION, color), language, (value: string) => {
    issueContent.description = value
  })
  const buttonsRow = buildButtonsRow(
    language,
    () => {
      Api.reportIssue(issueContent)
        .then((r: any) => {
          descriptionRow.setError('')
          summaryRow.setError('')
          issuePickerRow.setError('')
          const successAlert = buildSuccessAlert(language, () => container.remove())
          alertContainer.innerHTML = ''
          alertContainer.appendChild(successAlert)
        })
        .catch((e: any) => {
          const errorMessages = buildErrorMessages(e.response.content.errors, language)
          descriptionRow.setError(errorMessages.descriptionError)
          summaryRow.setError(errorMessages.summaryError)
          issuePickerRow.setError(errorMessages.issueTypeError)
        })
    },
    () => {
      container.remove()
    }
  )

  alertContainer.appendChild(venueTitleRow.container)
  alertContainer.appendChild(placeTitleRow.container)
  alertContainer.appendChild(emailRow.container)
  alertContainer.appendChild(issuePickerRow.container)
  alertContainer.appendChild(summaryRow.container)
  alertContainer.appendChild(descriptionRow.container)
  alertContainer.appendChild(buttonsRow)

  return container
}

const buildSuccessAlert = (language: string, onclick: () => void): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('mwz-success-alert')
  const successMessage = document.createElement('div')
  successMessage.classList.add('mwz-success-message')
  successMessage.innerHTML = lang_issue_reported_success(language)

  const okButton = document.createElement('div')
  okButton.classList.add('mwz-success-okbutton')
  okButton.innerHTML = 'OK'
  okButton.onclick = onclick

  container.appendChild(successMessage)
  container.appendChild(okButton)

  return container
}

const buildVenueTitleRow = (title: string, iconBase64: string, language: string): { setError: (message: string) => void; container: HTMLElement } => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  const labelContainer = document.createElement('div')
  labelContainer.classList.add('mwz-issue-label-container')
  const icon = document.createElement('img')
  icon.src = iconBase64
  labelContainer.appendChild(icon)
  const label = document.createElement('div')
  label.classList.add('mwz-label')
  label.innerHTML = lang_venue(language)
  const value = document.createElement('div')
  value.classList.add('mwz-issue-value')
  value.innerHTML = title
  labelContainer.appendChild(label)
  container.appendChild(labelContainer)
  container.appendChild(value)
  const setError: (message: string) => void = (message: string) => {}
  return {
    setError,
    container,
  }
}

const buildPlaceTitleRow = (title: string, iconBase64: string, language: string): { setError: (message: string) => void; container: HTMLElement } => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  const labelContainer = document.createElement('div')
  labelContainer.classList.add('mwz-issue-label-container')
  const icon = document.createElement('img')
  icon.src = iconBase64
  labelContainer.appendChild(icon)
  const label = document.createElement('div')
  label.classList.add('mwz-label')
  label.innerHTML = lang_place(language)
  const value = document.createElement('div')
  value.classList.add('mwz-issue-value')
  value.innerHTML = title
  labelContainer.appendChild(label)
  container.appendChild(labelContainer)
  container.appendChild(value)
  const setError: (message: string) => void = (message: string) => {}
  return {
    setError,
    container,
  }
}

const buildEmailRow = (
  userInfo: any,
  iconBase64: string,
  language: string,
  valueChange: (value: string) => void
): { setError: (message: string) => void; container: HTMLElement } => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  const header = document.createElement('div')
  header.classList.add('mwz-issue-row-header')
  const labelContainer = document.createElement('div')
  labelContainer.classList.add('mwz-issue-label-container')
  const icon = document.createElement('img')
  icon.src = iconBase64
  labelContainer.appendChild(icon)
  const label = document.createElement('div')
  label.classList.add('mwz-label')
  label.innerHTML = lang_issue_email(language)
  const error = document.createElement('div')
  error.classList.add('mwz-issue-row-error')
  labelContainer.appendChild(label)
  header.appendChild(labelContainer)
  header.appendChild(error)
  const value = document.createElement('input')
  value.classList.add('mwz-textfield')
  value.classList.add('mwz-issue-value')
  value.placeholder = lang_issue_email(language)
  value.setAttribute('type', 'text')
  value.value = userInfo?.email || ''
  value.oninput = (e) => valueChange((e.target as HTMLInputElement).value)
  container.appendChild(header)
  container.appendChild(value)
  const setError: (message: string) => void = (message: string) => {
    error.innerHTML = message
  }
  return {
    setError,
    container,
  }
}

const buildIssueTypePickerRow = (
  iconBase64: string,
  issuesTypes: any[],
  language: string,
  valueChange: (value: string) => void
): { setError: (message: string) => void; container: HTMLElement } => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  const header = document.createElement('div')
  header.classList.add('mwz-issue-row-header')
  const labelContainer = document.createElement('div')
  labelContainer.classList.add('mwz-issue-label-container')
  const icon = document.createElement('img')
  icon.src = iconBase64
  labelContainer.appendChild(icon)
  const label = document.createElement('div')
  label.classList.add('mwz-label')
  label.innerHTML = lang_issue_type(language)
  const error = document.createElement('div')
  labelContainer.appendChild(label)
  error.classList.add('mwz-issue-row-error')
  header.appendChild(labelContainer)
  header.appendChild(error)
  const value = document.createElement('div')
  value.classList.add('mwz-issue-picker')
  value.classList.add('mwz-issue-value')
  const radioButtons: HTMLElement[] = []
  issuesTypes.forEach((it, i) => {
    const issueContainer = document.createElement('div')
    issueContainer.classList.add('mwz-radio-button')
    issueContainer.id = '' + i
    issueContainer.onclick = (e) => {
      radioButtons.forEach((rb, i) => {
        if ('' + i === (e.target as HTMLElement).id) {
          rb.classList.add('selected')
          valueChange(issuesTypes[i]._id)
        } else {
          rb.classList.remove('selected')
        }
      })
    }
    const title = document.createElement('span')
    title.innerHTML = titleForLanguage(it, language)
    title.id = '' + i
    issueContainer.appendChild(title)
    value.appendChild(issueContainer)
    radioButtons.push(issueContainer)
  })

  container.appendChild(header)
  container.appendChild(value)
  const setError: (message: string) => void = (message: string) => {
    error.innerHTML = message
  }
  return {
    setError,
    container,
  }
}

const buildSummaryRow = (iconBase64: string, language: string, valueChange: (value: string) => void): { setError: (message: string) => void; container: HTMLElement } => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  const header = document.createElement('div')
  header.classList.add('mwz-issue-row-header')
  const labelContainer = document.createElement('div')
  labelContainer.classList.add('mwz-issue-label-container')
  const icon = document.createElement('img')
  icon.src = iconBase64
  labelContainer.appendChild(icon)
  const label = document.createElement('div')
  label.classList.add('mwz-label')
  label.innerHTML = lang_summary(language)
  labelContainer.appendChild(label)
  const error = document.createElement('div')
  error.classList.add('mwz-issue-row-error')
  header.appendChild(labelContainer)
  header.appendChild(error)
  const value = document.createElement('input')
  value.classList.add('mwz-textfield')
  value.classList.add('mwz-issue-value')
  value.placeholder = lang_summary(language)
  value.setAttribute('type', 'text')
  value.oninput = (e) => valueChange((e.target as HTMLInputElement).value)
  container.appendChild(header)
  container.appendChild(value)
  const setError: (message: string) => void = (message: string) => {
    error.innerHTML = message
  }
  return {
    setError,
    container,
  }
}

const buildDescriptionRow = (iconBase64: string, language: string, valueChange: (value: string) => void): { setError: (message: string) => void; container: HTMLElement } => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  const header = document.createElement('div')
  header.classList.add('mwz-issue-row-header')
  const labelContainer = document.createElement('div')
  labelContainer.classList.add('mwz-issue-label-container')
  const icon = document.createElement('img')
  icon.src = iconBase64
  labelContainer.appendChild(icon)
  const label = document.createElement('div')
  label.classList.add('mwz-label')
  label.innerHTML = lang_description(language)
  labelContainer.appendChild(label)
  const error = document.createElement('div')
  error.classList.add('mwz-issue-row-error')
  header.appendChild(labelContainer)
  header.appendChild(error)
  const value = document.createElement('textarea')
  value.classList.add('mwz-textarea')
  value.classList.add('mwz-issue-value')
  value.placeholder = lang_description(language)
  value.oninput = (e) => valueChange((e.target as HTMLTextAreaElement).value)
  value.setAttribute('type', 'text')

  container.appendChild(header)
  container.appendChild(value)
  const setError: (message: string) => void = (message: string) => {
    error.innerHTML = message
  }
  return {
    setError,
    container,
  }
}

const buildButtonsRow = (language: string, onSendClick: () => void, onCancelClick: () => void): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  container.classList.add('mwz-buttons-container')
  const send = document.createElement('div')
  send.onclick = onSendClick
  send.classList.add('mwz-send-button')
  const sendTitle = document.createElement('span')
  sendTitle.innerHTML = lang_send(language)
  send.appendChild(sendTitle)
  const cancel = document.createElement('div')
  cancel.onclick = onCancelClick
  cancel.classList.add('mwz-cancel-button')
  const cancelTitle = document.createElement('span')
  cancelTitle.innerHTML = lang_cancel(language)
  cancel.appendChild(cancelTitle)
  container.appendChild(send)
  container.appendChild(cancel)
  return container
}

const buildErrorMessages = (errors: any, language: string): { emailError?: string; issueTypeError?: string; summaryError?: string; descriptionError?: string } => {
  const errorMessages = {
    issueTypeError: errors.issueTypeId?.code || '',
    summaryError: errors.summary?.code || '',
    descriptionError: errors.description?.code || '',
  }

  if (errorMessages.issueTypeError === 'error.required') {
    errorMessages.issueTypeError = lang_error_required(language)
  }

  if (errorMessages.summaryError === 'error.required') {
    errorMessages.summaryError = lang_error_required(language)
  }

  if (errorMessages.descriptionError === 'error.required') {
    errorMessages.descriptionError = lang_error_required(language)
  }
  return errorMessages
}
