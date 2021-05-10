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
import { titleForLanguage } from '../utils/formatter'
import './reportIssuesView.scss'

export const buildReportIssuesView = (venue: any, placeDetails: any, userInfo: any, language: string): HTMLElement => {
  var issueContent: any = {
    owner: venue.owner,
    venueId: venue._id,
    placeId: placeDetails._id,
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

  const venueTitleRow = buildVenueTitleRow(venueTitle, language)
  const placeTitleRow = buildPlaceTitleRow(placeTitle, language)
  const emailRow = buildEmailRow(userInfo, language, (value: string) => {
    issueContent.reporterEmail = value
  })
  const issuePickerRow = buildIssueTypePickerRow(placeDetails.issueTypes, language, (value: string) => {
    issueContent.issueTypeId = value
  })
  const summaryRow = buildSummaryRow(language, (value: string) => {
    issueContent.summary = value
  })
  const descriptionRow = buildDescriptionRow(language, (value: string) => {
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

const buildVenueTitleRow = (title: string, language: string): { setError: (message: string) => void; container: HTMLElement } => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  const label = document.createElement('div')
  label.classList.add('mwz-label')
  label.innerHTML = lang_venue(language)
  const value = document.createElement('div')
  value.innerHTML = title

  container.appendChild(label)
  container.appendChild(value)
  const setError: (message: string) => void = (message: string) => {}
  return {
    setError,
    container,
  }
}

const buildPlaceTitleRow = (title: string, language: string): { setError: (message: string) => void; container: HTMLElement } => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  const label = document.createElement('div')
  label.classList.add('mwz-label')
  label.innerHTML = lang_place(language)
  const value = document.createElement('div')
  value.innerHTML = title

  container.appendChild(label)
  container.appendChild(value)
  const setError: (message: string) => void = (message: string) => {}
  return {
    setError,
    container,
  }
}

const buildEmailRow = (userInfo: any, language: string, valueChange: (value: string) => void): { setError: (message: string) => void; container: HTMLElement } => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  const header = document.createElement('div')
  header.classList.add('mwz-issue-row-header')
  const label = document.createElement('div')
  label.classList.add('mwz-label')
  label.innerHTML = lang_issue_email(language)
  const error = document.createElement('div')
  error.classList.add('mwz-issue-row-error')
  header.appendChild(label)
  header.appendChild(error)
  const value = document.createElement('input')
  value.classList.add('mwz-textfield')
  value.placeholder = lang_issue_email(language)
  value.setAttribute('type', 'text')
  value.value = userInfo?.email
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

const buildIssueTypePickerRow = (issuesTypes: any[], language: string, valueChange: (value: string) => void): { setError: (message: string) => void; container: HTMLElement } => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  const header = document.createElement('div')
  header.classList.add('mwz-issue-row-header')
  const label = document.createElement('div')
  label.classList.add('mwz-label')
  label.innerHTML = lang_issue_type(language)
  const error = document.createElement('div')
  error.classList.add('mwz-issue-row-error')
  header.appendChild(label)
  header.appendChild(error)
  const value = document.createElement('div')
  value.classList.add('mwz-issue-picker')
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

const buildSummaryRow = (language: string, valueChange: (value: string) => void): { setError: (message: string) => void; container: HTMLElement } => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  const header = document.createElement('div')
  header.classList.add('mwz-issue-row-header')
  const label = document.createElement('div')
  label.classList.add('mwz-label')
  label.innerHTML = lang_summary(language)
  const error = document.createElement('div')
  error.classList.add('mwz-issue-row-error')
  header.appendChild(label)
  header.appendChild(error)
  const value = document.createElement('input')
  value.classList.add('mwz-textfield')
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

const buildDescriptionRow = (language: string, valueChange: (value: string) => void): { setError: (message: string) => void; container: HTMLElement } => {
  const container = document.createElement('div')
  container.classList.add('mwz-issue-row')
  const header = document.createElement('div')
  header.classList.add('mwz-issue-row-header')
  const label = document.createElement('div')
  label.classList.add('mwz-label')
  label.innerHTML = lang_description(language)
  const error = document.createElement('div')
  error.classList.add('mwz-issue-row-error')
  header.appendChild(label)
  header.appendChild(error)
  const value = document.createElement('textarea')
  value.classList.add('mwz-textarea')
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
