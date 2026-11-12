# .NET Interview Roadmap

`interview-portal/` is the ASP.NET Core and React study application. Setup is in [interview-portal/README.md](interview-portal/README.md).

The rest of this folder is a static study library. Python scripts generate the HTML and PDF guides. Those guides are separate from the portal.

`index.html` is a local dashboard for the generated guides. It replaces Python’s default directory listing.

## Open the dashboard

From this directory, run:

```
python -m http.server 8000
```

Then open http://localhost:8000/

The server serves `index.html` at the site root. Study guides, PDFs, and the Word roadmap are linked from that page. The dashboard does not use a package install, a bundler, or an external network.

## Rebuild a guide

Run the matching builder from this directory. Each HTML builder also writes the PDF when Microsoft Edge is available.

| Script | Writes |
| --- | --- |
| `python build_roadmap.py` | `NET-Tech-Lead-10-Day-Interview-Roadmap.docx` |
| `python build_deep.py` | `NET-Tech-Lead-10-Day-Deep-Dive.html` and `.pdf` |
| `python build_arch30.py` | `NET-Angular-Technical-Architect-30-Day.html` and `.pdf` |
| `python build_study20.py` | `NET-Further-20-Day-Study.html` and `.pdf` |
| `python build_prep_depth.py` | `NET-Auth-Scale-Azure-SQL.html` and `.pdf` |
| `python build_angular.py` | `Angular-Interview-2-Years.html` and `.pdf` |
| `python build_dsa_sd.py` | `NET-DSA-and-System-Design.html` and `.pdf` |
| `python build_jobs.py` | `India-High-Pay-Job-Search.html` and `.pdf` |

`render_html.py` writes standalone HTML with embedded CSS. `render_docx.py` writes the roadmap Word document. Day-level modules are imported by those builders and are not listed on the dashboard.
