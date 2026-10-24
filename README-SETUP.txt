ADIL ANWAR PORTFOLIO — DEPLOYMENT GUIDE
======================================

CONTENTS
- index.html: portfolio content and structure
- style.css: dark neon styling and responsive layouts
- script.js: navigation, scroll effects, and contact-form submission
- assets/aa-monogram.svg: AA logo and favicon
- assets/Adil_Anwar_CV.pdf: downloadable CV

BEFORE PUBLISHING
1. Open index.html locally and review every section.
2. The profile image path is assets/images/profile.jpg. If you want your own photo in the hero, create the folder assets/images and put your photo there named exactly profile.jpg. If you don't add a photo, the site will show an AA monogram fallback instead of a broken image.
3. Open the CV link and confirm that assets/Adil_Anwar_CV.pdf is the latest CV you want public.
4. The contact form sends messages to adilanwartester95@gmail.com using FormSubmit. On the first live test, FormSubmit should send an activation/confirmation email to that inbox. Click the activation link, then submit a second test and check Inbox and Spam. The form cannot be fully verified until the owner activates it and tests it on the published site.
5. Check that the email address and social profile links in index.html/script.js are the ones you want to publish.

PUBLISH FREE WITH GITHUB PAGES
1. Sign in to https://github.com/ (create an account if needed).
2. Click the + icon, choose New repository, and name it adil-anwar-portfolio (or another name you prefer).
3. Choose Public if using GitHub Free for this simple Pages setup. Do not upload passwords, private keys, or other private files.
4. Create the repository. Open it and choose Add file > Upload files.
5. Extract this ZIP on your computer first. Upload the CONTENTS of the adil-portfolio-demo folder (index.html, style.css, script.js, assets folder and this README). Important: index.html must be in the repository root, not hidden inside another folder.
6. Click Commit changes.
7. Open repository Settings > Pages.
8. Under Build and deployment, choose Deploy from a branch. Select branch main and folder /(root), then Save.
9. Wait for the GitHub Pages build to finish. Refresh Settings > Pages and click Visit site. A project URL typically looks like https://YOUR-USERNAME.github.io/adil-anwar-portfolio/.
10. Open the live site on a phone and computer. Test navigation, CV download, footer Back to Top, and the contact form.
11. It can take a few minutes for the first deployment. If the site does not appear, check the Actions tab for deployment errors.

CONTACT FORM ACTIVATION / TEST
1. Visit your published site over its https URL.
2. Enter a test name, an email address you can access, a subject, and a message of at least 10 characters.
3. Click Send message.
4. Check adilanwartester95@gmail.com, including Spam, for the FormSubmit activation email and click its confirmation link if requested.
5. Submit the form again and verify that the email arrives. Reply to the sender using the Reply-To field.
6. If the form fails, the direct email link remains available on the page. Do not claim the form is working until this live test succeeds.

NOTES
- GitHub Pages hosts static HTML/CSS/JavaScript. This portfolio uses a hosted form service so it does not need a custom server.
- The GitHub repository and published website are public. Review the CV and all contact/social information before uploading.
- The site is responsive with layouts for desktop, laptop, tablet, and narrow mobile screens, but test on real devices after publishing.
