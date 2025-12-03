function RequirementsPage({ onBack }) {
  return (
    <div className="glass-card p-6 md:p-8 mt-6 text-left">
      <h2 className="text-2xl font-semibold mb-2">Usage requirements</h2>
      <p className="text-sm text-midnight-400 mb-6">
        This page describes the requirements for using the app with Google Cloud Vision API, how
        pricing and limits work at a high level, and what to consider for GDPR and use in Europe.
        It is a technical overview only and does not constitute legal advice.
      </p>

      <div className="space-y-6 text-sm text-midnight-100">
        <section>
          <h3 className="font-semibold mb-2">1. Pricing, quotas and limits (Google)</h3>
          <ul className="list-disc list-inside space-y-1 text-midnight-300">
            <li>
              Google Cloud Vision API is a paid service. Google defines pricing per feature
              (e.g. face detection) and currently offers a free tier of around 1,000 units /
              requests per month per feature.
            </li>
            <li>
              Your costs depend on how many images / requests you send and which detection features
              you enable. Check the official pricing page in the Google Cloud documentation before
              using this app in production.
            </li>
            <li>
              Google enforces quotas such as maximum requests per minute, per day, and per project.
              These limits can usually be increased by requesting higher quotas from Google.
            </li>
            <li>
              Monitor your usage in the Google Cloud Console and configure budget alerts / quota
              alerts to avoid unexpected costs.
            </li>
            <li>
              The app itself does not add any extra pricing on top of what Google charges; you pay
              Google directly according to your own Cloud project configuration.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold mb-2">
            2. Setting up Google Cloud, Vision API and basic GDPR-related settings
          </h3>
          <ul className="list-disc list-inside space-y-1 text-midnight-300">
            <li>You need a Google Cloud Platform (GCP) account and a project you control.</li>
            <li>
              In the Google Cloud Console, create or select a project, then enable the{' '}
              <span className="font-mono">Cloud Vision API</span> for that project.
            </li>
            <li>
              Configure a billing account, budgets and alerts for the project so you can control
              spending.
            </li>
            <li>
              Create an API key under &quot;APIs &amp; Services &gt; Credentials&quot;, restrict it
              to the Vision API and to the allowed domains (HTTP referrers) where this app is
              hosted.
            </li>
            <li>
              As the operator, you should sign or accept Google&apos;s Data Processing Agreement
              (DPA) and select appropriate data-processing locations / regions when available, to
              align with your GDPR obligations.
            </li>
            <li>
              Review Google&apos;s security and privacy documentation to understand how Google
              processes data sent to the Vision API.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold mb-2">
            3. GDPR restrictions, legality in Europe and image handling
          </h3>
          <ul className="list-disc list-inside space-y-1 text-midnight-300">
            <li>
              Using Google Cloud Vision API in Europe can be lawful under GDPR if you have a valid
              legal basis (for example, consent or legitimate interest), inform data subjects
              transparently and implement appropriate technical and organisational measures.
            </li>
            <li>
              You are the data controller for the images you upload. Google generally acts as a data
              processor for the Vision API and you must ensure the DPA and international transfer
              mechanisms (if data leaves the EU/EEA) are acceptable for your use case.
            </li>
            <li>
              Configure Google Cloud regions and storage options in line with your data residency and
              transfer requirements, and document this in your internal records / privacy notice.
            </li>
            <li>
              This app is designed so that images are processed in your browser and sent only to
              Google&apos;s Vision API for face detection. The app itself does not intentionally
              store or log user images on a separate backend; blurring happens client-side using the
              face coordinates returned by the API.
            </li>
            <li>
              Even with this design, you must still apply GDPR principles such as data minimisation,
              limited retention, and access control. Avoid uploading images with more personal data
              than necessary and delete or avoid retaining original images once blurring is done.
            </li>
            <li>
              Whether your specific processing is legal will always depend on your concrete use case,
              your legal basis, and your configuration of Google Cloud. When in doubt, consult your
              legal or data protection advisor.
            </li>
          </ul>
        </section>

        <section className="border-t border-midnight-700 pt-4 mt-2 text-xs text-midnight-500">
          <p>
            This description is provided for information only and does not constitute legal or
            regulatory advice. For concrete questions about GDPR, international transfers, or the
            legality of your particular use case in Europe, consult your legal or data protection
            advisor.
          </p>
        </section>
      </div>

      {onBack && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="btn-primary text-sm px-5 py-2.5"
          >
            Back to Privacy Blur
          </button>
        </div>
      )}
    </div>
  );
}

export default RequirementsPage;


