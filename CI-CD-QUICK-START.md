# 🚀 CI/CD Pipeline Quick Setup

Your GitHub Actions CI/CD pipeline is now ready! Follow these steps to enable it fully.

## ✅ What's Included

- **ci-cd.yml** - Main pipeline (frontend build, backend tests, deployments)
- **frontend.yml** - Frontend-specific workflow  
- **backend.yml** - Backend-specific workflow (Python 3.8-3.10)
- **security.yml** - Security scanning (Trivy, Bandit)

## 📝 Required GitHub Secrets

Add these to your repository: **Settings → Secrets and variables → Actions**

### Frontend Deployment (Choose One)

**Vercel:**
```
VERCEL_TOKEN          # From vercel.com/account/tokens
VERCEL_PROJECT_ID     # From project settings
VERCEL_ORG_ID         # From organization settings
```

**Netlify:**
```
NETLIFY_AUTH_TOKEN    # From netlify.com/user/applications
NETLIFY_SITE_ID       # From site settings
```

### Backend Deployment (Choose One)

**Heroku:**
```
HEROKU_API_KEY              # heroku authorizations:create
HEROKU_EMAIL                # Your email
HEROKU_APP_NAME_STAGING     # e.g., ai-agri-staging
HEROKU_APP_NAME_PRODUCTION  # e.g., ai-agri-prod
```

**Railway:**
```
RAILWAY_TOKEN               # From railway.app settings
```

### Optional - Code Quality & Notifications

```
SONAR_TOKEN                 # SonarCloud token (optional)
SLACK_WEBHOOK_URL          # For Slack notifications (optional)
VITE_API_BASE_URL          # Frontend API URL (e.g., https://api.example.com)
```

## 🔧 Setup Steps

### 1. Add GitHub Secrets

```bash
# Example for Vercel
Settings → Secrets and variables → Actions → New repository secret
```

### 2. Create Procfile for Backend (if using Heroku)

```bash
cd backend
echo 'web: uvicorn main:app --host 0.0.0.0 --port $PORT' > Procfile
git add Procfile
git commit -m "add: Heroku Procfile"
git push origin main
```

### 3. Create .env Files (if needed)

**backend/.env.example:**
```
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your-secret-key-here
DEBUG=False
```

**frontend/.env.example:**
```
VITE_API_BASE_URL=http://localhost:8000
```

### 4. View Pipeline Status

Go to: **Actions tab** → See all workflows running

### 5. Configure Branch Protection (Recommended)

```
Settings → Branches → Add branch protection rule

For main branch:
- Require pull request reviews: 1
- Require status checks to pass:
  ✓ frontend-test
  ✓ backend-test
```

## 📊 Workflow Triggers

| Branch | Trigger | Action |
|--------|---------|--------|
| `main` | Push | Full CI/CD + Deploy to Production |
| `develop` | Push | Tests + Build (No deploy) |
| Pull Request | Any branch | Tests + Linting |
| Weekly | Sunday 00:00 | Security scanning |

## 🎯 Next Steps

1. **Add GitHub Secrets** (required for deployment)
2. **Test locally first:**
   ```bash
   npm run build        # frontend
   pytest backend/      # backend
   ```
3. **Create a develop branch:**
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```
4. **Make a test PR** to verify pipeline works
5. **Monitor Actions tab** for any failures

## 🆘 Troubleshooting

### Secrets not working?
- Verify secret names match exactly (case-sensitive)
- Secrets added after workflow creation need workflow re-run
- Check "Secrets and variables" vs "Environments"

### Build failure?
- Click failed workflow → View logs
- Check dependencies are in requirements.txt or package.json
- Verify Node/Python versions match

### Deployment failing?
- Verify API tokens are valid
- Check deployment target exists (Heroku app, Vercel project)
- Review deployment logs in Actions tab

## 📚 Documentation

See `docs/CI-CD-SETUP.md` for comprehensive setup guide including:
- Detailed Vercel/Netlify/Heroku setup
- SonarCloud integration
- Slack notifications
- Branch protection rules
- Best practices

## 🔗 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Deploy](https://vercel.com/docs/git/github)
- [Netlify Deploy](https://docs.netlify.com/git/overview)
- [Heroku Deploy](https://devcenter.heroku.com/articles/github-integration)

---

**Status:** ✅ Ready to Deploy

**Next:** Add secrets and test your first deployment!
