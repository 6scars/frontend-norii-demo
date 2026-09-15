import type { ChangeEventHandler } from 'react'
import type { PublicationConsent } from '../../shared/types/domain.ts'
import type { SongUploadErrors } from '../../modules/Upload/song-upload.ts'
import type { SongForm } from './song-form.ts'
import Icon from '../../shared/ui/Icon.tsx'

interface UploadReviewProps {
  audioUrl: string | null
  consent: PublicationConsent
  errors: SongUploadErrors
  form: SongForm
  imageUrl: string | null
  onConsentChange: ChangeEventHandler<HTMLInputElement>
  policyVersion: string
}

export default function UploadReview({
  audioUrl,
  consent,
  errors = {},
  form,
  imageUrl,
  onConsentChange,
  policyVersion,
}: UploadReviewProps) {
  const consentError = [
    errors.audioRightsConfirmed,
    errors.coverRightsConfirmed,
    errors.publishingTermsAccepted,
  ].filter(Boolean).join(' ')

  return (
    <div className="upload-review">
      <div className="upload-review__cover">{imageUrl ? <img alt="Podgląd okładki utworu" src={imageUrl} /> : <Icon name="plus" size={42} />}</div>
      <div className="upload-review__copy"><span>GOTOWE DO WYSŁANIA</span><h2>{form.song_name || 'Tytuł utworu'}</h2><p>{form.credit || 'Bez dodatkowego opisu'}</p><small>{form.album_name || 'Bez połączenia z albumem'}</small></div>
      <div className="upload-review__audio">{audioUrl ? <audio controls preload="metadata" src={audioUrl} /> : <p>Dodaj plik MP3, aby odsłuchać podgląd.</p>}</div>
      <section aria-labelledby="upload-consents-title" className={consentError ? 'upload-review__consents upload-review__consents--error' : 'upload-review__consents'}>
        <div className="upload-review__consents-heading">
          <span>PRZED PUBLIKACJĄ</span>
          <h3 id="upload-consents-title">Potwierdź prawa do materiałów</h3>
          <p>Wszystkie oświadczenia są wymagane, aby wysłać utwór.</p>
        </div>
        <fieldset aria-describedby={consentError ? 'upload-consents-error' : undefined}>
          <legend>Wymagane oświadczenia</legend>
          <label>
            <input checked={consent.audioRightsConfirmed} name="audioRightsConfirmed" onChange={onConsentChange} required type="checkbox" />
            <span><strong>Mam prawa do utworu i nagrania.</strong><small>Jestem ich autorem lub mam zgodę wszystkich uprawnionych osób.</small></span>
          </label>
          <label>
            <input checked={consent.coverRightsConfirmed} name="coverRightsConfirmed" onChange={onConsentChange} required type="checkbox" />
            <span><strong>Mam prawa do okładki lub zdjęcia.</strong><small>Mogę je opublikować i mam zgodę osób przedstawionych na materiale.</small></span>
          </label>
          <label>
            <input checked={consent.publishingTermsAccepted} name="publishingTermsAccepted" onChange={onConsentChange} required type="checkbox" />
            <span><strong>Akceptuję zasady publikowania treści.</strong><small>Biorę odpowiedzialność za przesłane materiały i podane informacje.</small></span>
          </label>
        </fieldset>
        {consentError ? <p className="upload-review__consents-error" id="upload-consents-error" role="alert">{consentError}</p> : null}
        <details>
          <summary>Zobacz zasady publikacji</summary>
          <ul>
            <li>Publikuj wyłącznie treści własne lub takie, do których masz odpowiednie prawa i zgody.</li>
            <li>Nie przesyłaj materiałów naruszających prawa autorskie, dobra osobiste ani prywatność innych osób.</li>
            <li>Serwis może wstrzymać publikację lub usunąć treść po otrzymaniu wiarygodnego zgłoszenia naruszenia.</li>
          </ul>
        </details>
        <small>Wersja zasad: {policyVersion}</small>
      </section>
    </div>
  )
}
