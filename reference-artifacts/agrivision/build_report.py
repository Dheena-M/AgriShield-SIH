from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

OUT = r"C:\Users\M R K\Desktop\VET HT\AgriVision-AI\AgriVision_AI_Project_Report.pdf"
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleGreen", parent=styles["Title"], textColor=colors.HexColor("#1B5E20"), fontSize=26, leading=31))
styles.add(ParagraphStyle(name="SectionGreen", parent=styles["Heading2"], textColor=colors.HexColor("#1B5E20"), spaceBefore=12, spaceAfter=6))
styles.add(ParagraphStyle(name="BodyClean", parent=styles["BodyText"], fontSize=10.5, leading=15, spaceAfter=5))
doc = SimpleDocTemplate(OUT, pagesize=A4, rightMargin=1.7*cm, leftMargin=1.7*cm, topMargin=1.5*cm, bottomMargin=1.5*cm)
story=[]
story += [Paragraph("AgriVision AI",styles["TitleGreen"]), Paragraph("Smart Agriculture Decision Support System - Hackathon Project Report",styles["Heading3"]), Spacer(1,12)]
story += [Paragraph("Problem statement",styles["SectionGreen"]), Paragraph("Farmers may struggle to identify crop diseases at an early stage. Manual identification can require expert knowledge and can delay action, increasing crop-loss risk. Soil, climate and crop-planning information is often considered separately instead of together.",styles["BodyClean"])]
story += [Paragraph("Proposed solution",styles["SectionGreen"]), Paragraph("AgriVision AI is a web dashboard that accepts a crop-leaf image and farm inputs, produces a preliminary disease indication, and combines it with soil, climate, crop and yield guidance. It supports earlier awareness and better-informed farm decisions.",styles["BodyClean"])]
story += [Paragraph("Core features",styles["SectionGreen"])]
features=[["Feature","What it provides"],["AI disease detection","A trained PlantVillage transfer-learning model with 19 disease classes and 81.49% validation accuracy."],["Tamil Nadu district profile","District selection, indicative climate values and suitable crop context."],["Disease-risk alert","Transparent risk alert based on humidity, rainfall, temperature and crop susceptibility."],["Soil health analysis","NPK and pH assessment with general fertilizer guidance."],["Crop recommendation","Top crop matches from soil nutrients and climate conditions."],["Yield simulator","Estimated yield, total production and growth-risk view."],["Farm report","Farmer profile and session results downloadable as CSV."]]
t=Table(features,colWidths=[4.2*cm,12.2*cm]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#1B5E20')),('TEXTCOLOR',(0,0),(-1,0),colors.white),('FONTNAME',(0,0),(-1,0),'Helvetica-Bold'),('GRID',(0,0),(-1,-1),0.35,colors.HexColor('#C8D9C5')),('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,1),(-1,-1),colors.HexColor('#F3F7F2')),('FONTSIZE',(0,0),(-1,-1),9),('LEADING',(0,0),(-1,-1),12),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]));story.append(t)
story += [PageBreak(),Paragraph("System flow",styles["SectionGreen"]),Paragraph("Crop-leaf image + farmer profile + NPK/pH soil data + district climate/weather data -> AI and farm analysis -> disease category + disease-risk alert + crop recommendation -> preventive guidance + yield simulation + downloadable report.",styles["BodyClean"])]
story += [Paragraph("Technology used",styles["SectionGreen"]),Paragraph("Python, Streamlit, TensorFlow/Keras, MobileNetV2 transfer learning, Pandas, Plotly/Streamlit charts, CSV datasets, and optional OpenWeatherMap API integration.",styles["BodyClean"])]
story += [Paragraph("Impact",styles["SectionGreen"]),Paragraph("The platform can help farmers identify possible disease risks earlier, understand general preventive practices, select crops based on farm conditions, and compare expected crop performance. Combining leaf AI with soil and climate information makes the project more useful than a standalone image classifier.",styles["BodyClean"])]
story += [Paragraph("Responsible AI note",styles["SectionGreen"]),Paragraph("Disease output is an AI-based preliminary indication for awareness and decision support. It is not a replacement for professional agricultural diagnosis, laboratory soil testing or local extension advice.",styles["BodyClean"])]
story += [Paragraph("Demo flow",styles["SectionGreen"]),Paragraph("1. Select a Tamil Nadu district and enter farmer details. 2. Upload a Tomato, Potato, Corn or Pepper leaf image. 3. Show the AI prediction and disease-risk alert. 4. Enter soil values for crop and fertilizer guidance. 5. Run the yield simulator and download the farm report.",styles["BodyClean"])]
story += [Paragraph("Sources",styles["SectionGreen"]),Paragraph("Problem requirements: Smart Agriculture AI Crop Disease Problem Statement. Disease-training data: PlantVillage dataset. Weather integration: OpenWeatherMap API when configured.",styles["BodyClean"])]
doc.build(story)
