# Early_Detection_of_Chili_Leaf_Diseases_Using_Convo.pdf

Pages: 8

--- page 1 ---
 
 
E-ISSN : 2807-9035 
Volume 6, Number 3, August 2026 
https://doi.org/10.47709/brilliance.v6i3.8627 
  
 
 
This is an Creative Commons License This work is licensed under a Creative 
Commons Attribution-NonCommercial 4.0 International License.  
 
431 
Early Detection of Chili Leaf Diseases Using Convolutional Neural Network Based on 
Leaf Images 
 
Alam Bahari1*, Fadlisyah2, Hafizh Al Kautsar Aidilof 3 
1,2,3Informatics Engineering Study Program, Faculty of Engineering, Malikussaleh University, Indonesia.  
1*alam.220170042@mhs.unimal.ac.id, 2fadlisyah@unimal.ac.id, 3hafizh@unimal.ac.id  
 
 
 
*Corresponding Author 
 
ABSTRACT 
Chili plants ( Capsicum sp.) are one of the important horticultural commodities 
in Indonesia with high economic value. However, chili productivity is often 
reduced due to leaf diseases such as leaf curl, yellow leaf virus, and leaf spot 
disease. Manual disease identification conducted by farmers  still has several 
limitations because it requires considerable time, experience, and is prone to 
observation errors. Therefore, an automatic system is needed to support early 
detection of chili leaf diseases quickly and accurately. 
This study aims to deve lop a chili leaf disease classification system using a 
Convolutional Neural Network (CNN) based on leaf images. The dataset used in 
this study consists of chili leaf images categorized into four classes, namely 
healthy leaves, leaf curl, yellow leaf, and l eaf spot. The research stages include 
dataset collection, image preprocessing, data augmentation, CNN model 
training, and model evaluation using a confusion matrix  with performance 
metrics including accuracy, precision, recall, and F1-score. 
The results show that the CNN model is capable of classifying chili leaf diseases 
with satisfactory performance. Based on the evaluation results, the model 
achieved a precision value of 0.75, a recall value of 0.53, and a mean Average 
Precision (mAP@0.5) v alue of 0.60. The developed system is also able to 
display classification results along with the confidence score of the prediction. 
Therefore, the CNN method has strong potential to be implemented as an 
image-based early detection system for chili leaf di seases to assist farmers in 
monitoring plant conditions more effectively. 
Article History: 
Submitted: 21-05-2026 
Accepted: 29-05-2026 
Published: 22-07-2026 
Keywords:  
Capsicum annuum; 
Convolutional Neural Network; 
Deep Learning; Plant Disease 
Detection; Transfer Learning. 
Brilliance: Research of 
Artificial Intelligence is licensed 
under a Creative Commons 
Attribution-NonCommercial 4.0 
International (CC BY-NC 4.0). 
 
INTRODUCTION 
In Indonesia, chili ( Capsicum sp. ) plays an important role as a horticultural commodity due to its strong 
economic value and widespread consumption  (Inaya et al., 2022) . In addition to its economic value, chili offers 
nutritional benefits that support human health  (Wali et al., 2025) . Chili production is often disrupted by plant diseases 
that impact both the quantity and quality of harvests. Leaf curl disease is one of the major issues, causing abnormal leaf 
shape, color changes, and limited plant development, which co ntribute to yield loss  (Suyanto et al., 2023) . Other 
diseases, such as yellow leaf and leaf spot, also play a role in reducing chili production (Homepage et al., 2023). 
The occurrence of leaf curl disease is often related to viral pathogens, including Yellow Leaf Curl Virus 
(YLCV), which are typically carried and transmitted by whiteflies  (Gita Fakhira et al., n.d.) . Failure to identify the 
disease at an early stage can cause ineffective management, rising production expenses, and reduced farmer incom e. 
Thus, early detection becomes essential to prevent wider transmission and limit potential losses  (Rizki Ridhwan & 
Hudori, 2026). 
Current disease identification practices largely rely on human observation, making them prone to bias and 
inefficiency. In contrast, recent technological developments have enabled the use of artificial intelligence, especially 
deep learning, as a more reliable method for automatic detection  (Raup et al., 2022). In image classification tasks, deep 
learning approaches tend to  outperform traditional methods. One of the most commonly applied models is the 
Convolutional Neural Network (CNN), which is capable of learning meaningful features from image data without 
manual extraction  (Suhardin et al., 2021) . Several earlier studie s have shown that approaches based on CNN can 
successfully identify plant diseases (Rizki Ridhwan & Hudori, 2026). 
Previous studies on chili leaf disease detection have reported promising classification performance using CNN -
based models. Nevertheless, most studies rely on controlled datasets with limited environmental variability, which may 
lead to reduced performance when applied in real -world agricultural settings. Furthermore, several studies focus on 
binary classification or a small number of disease  categories, limiting their usefulness for practical disease diagnosis. 
The lack of studies utilizing field -acquired images with diverse backgrounds and lighting conditions highlights a 
research gap in developing more robust and practical disease detection  systems. Therefore, this study develops a CNN -
based classification model using real -world chili leaf images to detect healthy leaves, leaf curl, yellow leaf, and leaf 
spot diseases. The contribution of this research lies in evaluating the capability of CNN models to classify multiple chili 


--- page 2 ---
 
 
E-ISSN : 2807-9035 
Volume 6, Number 3, August 2026 
https://doi.org/10.47709/brilliance.v6i3.8627 
  
 
 
This is an Creative Commons License This work is licensed under a Creative 
Commons Attribution-NonCommercial 4.0 International License.  
 
432 
leaf diseases under realistic field conditions, thereby improving the applicability of deep learning techniques in 
precision agriculture. 
 
LITERATURE REVIEW 
Image Processing and Computer Vision in Agriculture 
The use of computer vision and image processing has grown in agricultural applications, particularly for 
identifying plant diseases. Through these methods, visual data can be interpreted to extract important information from 
digital images by analyzing color, texture , and spatial patterns  (Nyaga et al., 2020) . In digital images, each pixel 
represents specific values related to color and spatial positioning (Dengan Operator & Dan, n.d.). Various methods such 
as segmentation, feature extraction, and classification a re commonly applied to interpret image data effectively  
(Kulkarni et al., 2021). 
Computer vision technology allows systems to process and understand visual data similarly to how humans 
perceive it, and it has been extensively utilized in agriculture for tasks such as crop observation and disease recognition  
(Hanum & Artikel, 2024) . Image-based systems have advantages over traditional methods, including faster analysis, 
improved consistency, and the ability to scale efficiently. 
 
Machine Learning and Deep Learning Approaches 
Machine learning refers to an approach in artificial intelligence where systems are trained to recognize patterns 
from data and perform predictions independently, without relying on predefined rules  (Diana et al., 2023) . In many 
cases, traditional machine learning models use manually defined features, which can limit their ability to handle 
complex and dynamic environments effectively. 
Deep learning approaches leverage multi -layer neural architectures that can learn meaningful rep resentations 
directly from raw data without manual feature design  (Raup et al., 2022) . This technique has substantially improved 
image classification performance, as it is capable of representing complex patterns more effectively compared to 
traditional methods. 
 
Convolutional Neural Network (CNN) 
Among deep learning models, Convolutional Neural Networks (CNN) are extensively utilized for processing and 
analyzing visual information  (Suhardin et al., 2021) . CNN models process visual data by applying conv olution 
operations to learn spatial patterns and features. The architecture usually comprises several components, including 
convolutional layers, activation functions, pooling stages, and fully connected layers for classification  (Gunawan et al., 
2021).  
With this structure, the model is able to learn features in multiple levels, from simple visual elements such as 
edges and textures to more complex forms like shapes and objects. This hierarchical learning ability enables CNN to 
perform effectively in plant disease classification tasks. 
Findings from recent research highlight that CNN -based approaches maintain high effectiveness in image 
classification tasks, including their use in agricultural domains  (Mienye & Swart, 2024) , (Minaee et al., 2022) . More 
advanced architectures, including EfficientNet, are designed to achieve better efficiency while preserving high levels of 
accuracy (Muthulakshmi & Jayalakshmi, 2025) . Moreover, transfer learning approaches are frequently applied to 
enhance model effect iveness, particularly when the amount of training data is limited (Iman et al., 2023) . The use of 
data augmentation helps models generalize better and prevents overfitting during the training process (Zeng & Zeng, 
2024). In addition, classification performance is often assessed using metrics derived from the confusion matrix, which 
provide a comprehensive evaluation (Riehl et al., 2023). 
 
Dataset and Data Augmentation 
Deep learning model performance largely depends on the availability of sufficient data as well as the quality of 
the dataset used (G Hermawan, 2024). For better generalization, the dataset should capture a wide range of conditions, 
such as changes in lighting, orientation, and surrounding environment. 
Dataset diversity can be improved  through data augmentation, which also helps strengthen model robustness. 
Typical transformations applied include rotation, flipping, scaling, and translation. 
 
Evaluation Metrics for Classification Models 
To evaluate model performance, several metrics based on the confusion matrix are used, including accuracy, 
precision, recall, and F1-score (Fergus & Chalmers, 2022). The use of these metrics allows for a detailed assessment of 
classification performance, particularly in cases of imbalanced datasets. Furthermore, CNN -based approaches are 
extensively utilized in image classification tasks and have proven to be highly accurate in identifying patterns  (Ucan et 
al., 2022). Recent findings suggest that deep learning approaches can capture complex patterns  from large-scale data 
and significantly enhance classification performance  (Khan et al., 2023). Moreover, the use of data augmentation helps 
create more diverse datasets and supports better generalization in deep learning models (Fahd & Miah, 2023). 

--- page 3 ---
 
 
E-ISSN : 2807-9035 
Volume 6, Number 3, August 2026 
https://doi.org/10.47709/brilliance.v6i3.8627 
  
 
 
This is an Creative Commons License This work is licensed under a Creative 
Commons Attribution-NonCommercial 4.0 International License.  
 
433 
Previous Research and Research Gap 
Applying data augmentation techniques allows the dataset to become more varied and helps deep learning 
models perform better on unseen data  (Rizki Ridhwan & Hudori, 2026) . A number of existing studies are based on 
controlled environments, making their performance less reliable in real -world applications. Furthermore, several of 
these studies utilize limited data or concentrate on only a few disease categories. 
These limitations highlight the need for studies that re ly on real-world datasets and produce models that are both 
reliable and applicable in practical settings. To address this, the present study employs a CNN -based approach for 
detecting chili leaf diseases using data obtained directly from field conditions. 
 
METHOD 
Research Design 
This study employs a quantitative framework based on supervised learning with a Convolutional Neural Network 
(CNN) for image classification tasks. The main objective is to create an automated system that can recognize multiple 
chili leaf diseases using digital leaf images. The research workflow is carried out through several stages, including data 
acquisition, preprocessing, model construction, training, and performance evaluation. 
 
System Workflow 
The proposed system consists of two main processes, namely the training phase and the implementation phase. In 
the training phase, a dataset of chili leaf images is used as input to train the Convolutional Neural Network (CNN) 
model. The dataset is processed through the CNN architecture, al lowing the model to learn important features and 
patterns from the images. This process results in a trained CNN model that is capable of performing classification tasks. 
In the implementation phase, the system begins by receiving input data in the form of  images or video frames. 
The input data then undergoes a preprocessing stage, which includes normalization and resizing to ensure consistent 
input quality. After preprocessing, the data is passed into the trained CNN model for feature extraction and 
classification. The model analyzes the input and produces the final prediction result in real -time. The output represents 
the classification of chili leaf conditions, such as healthy, leaf curl, yellow leaf, or leaf spot. 
 
Figure 1. System Workflow of Proposed Model 
 
Data Collection 
The dataset used in this research consists of chili leaf images sourced directly from farmers in field 
environments. These images are classified into four categories, namely healthy, leaf curl, yellow leaf, and leaf spot. The 
data collection process was conducted under real -world conditions to include variations in lighting, background, and 
leaf orientation. To ensure reliable classification, each image was carefully labeled manually. Representative samples of 
the dataset are illustrated in Figure 2. 
 


--- page 4 ---
 
 
E-ISSN : 2807-9035 
Volume 6, Number 3, August 2026 
https://doi.org/10.47709/brilliance.v6i3.8627 
  
 
 
This is an Creative Commons License This work is licensed under a Creative 
Commons Attribution-NonCommercial 4.0 International License.  
 
434 
 
Figure 2. Sample images of chili leaf dataset (healthy, leaf curl, yellow leaf, and leaf spot) 
 
To support model development, the dataset is partitioned into three groups: 70% for training, 20% for validation, 
and 10% for testing. This split enables effective learning, hyperparameter adjustment, and unbiased performance 
assessment. 
 
Data Preprocessing 
Before training the model, preprocessing is applied to standardize the input data and improve overall model 
performance. This process involves resizing all images to a fixed dimension to ensure consistency and reduce 
computational complexity. In addition, pixel values are normalized to a range of 0 –1 to accelerate the training process 
and enhance convergence. Furthermore, data cleaning is performed by removing blurry, duplicated, or irrelevant images 
to maintain the overall quality of the dataset.  
 
Data Augmentation 
To increase dataset diversity and reduce the risk of overfitting, data augmentation techniques are applied by 
generating variations from existing images. These transformations include rotation, horizontal flipping, and vertical 
flipping, which allow the model to learn more robust and invariant features. As a result, the model  is better able to 
generalize and perform effectively under different environmental conditions. 
 
CNN Model Architecture 
The model used in this study is a Convolutional Neural Network (CNN) designed for multi -class image 
classification. The architecture pro cesses input images through several layers to extract and learn important visual 
features. Initially, convolution operations are applied to capture relevant patterns from the images, followed by 
activation functions such as ReLU to introduce non-linearity and enable the model to learn more complex relationships. 
The feature maps are then reduced in size through pooling operations, which help minimize computational complexity 
and reduce overfitting. After that, the extracted features are processed through fu lly connected layers to perform 
classification. Finally, the output layer generates prediction results in the form of class probabilities, including healthy,  
leaf curl, yellow leaf, and leaf spot. The model is implemented using the TensorFlow/Keras framewo rk to support 
efficient training and deployment. 
 
Model Training 
The training process is carried out by feeding the training dataset into the CNN model while adjusting its 
parameters to minimize classification errors. In this study, the training utilizes t he Adam optimizer and categorical 
crossentropy as the loss function, with the number of epochs determined based on convergence and the batch size 
adjusted according to system capability. During training, the model performs forward propagation to generate 
predictions and backpropagation to iteratively update the weights. In addition, validation data is used to monitor model 
performance and help prevent overfitting throughout the training process. 
 


--- page 5 ---
 
 
E-ISSN : 2807-9035 
Volume 6, Number 3, August 2026 
https://doi.org/10.47709/brilliance.v6i3.8627 
  
 
 
This is an Creative Commons License This work is licensed under a Creative 
Commons Attribution-NonCommercial 4.0 International License.  
 
435 
Model Evaluation 
After the training phase, the model is evaluated using the testing dataset to assess its performance on unseen data. 
The evaluation is carried out using metrics derived from the confusion matrix, including accuracy, precision, recall, and 
F1-score. Accuracy reflects the overall correctness of p redictions, while precision measures how accurate the positive 
predictions are. Recall indicates the model’s ability to correctly identify positive cases, and F1 -score provides a 
balanced measure by combining precision and recall. Together, these metrics o ffer a comprehensive evaluation of the 
model’s classification performance. 
 
RESULT 
The training and validation performance of the CNN model is illustrated in Fig. 3. The training results show that 
the loss values decrease consistently as the number of epoc hs increases. In addition, the precision improves and reaches 
approximately 0.75, while the recall stabilizes around 0.53. The mAP@0.5 also increases and reaches approximately 
0.60. These results indicate that the model successfully learns relevant feature s from the dataset and improves its 
performance over time. 
 
Figure 3. Training and validation performance of the CNN model 
 
CNN Model Performance Evaluation 
Table  1. Model Performance Evaluation 
Class Precision Recall mAP@0.5 
Leaf Spot 0.86 0.86 0.86 
Leaf Curl 0.55 0.55 0.55 
Yellow Leaf 0.38 0.38 0.38 
Healthy 0.71 0.71 0.71 
 
Based on Table 1, the CNN model achieved the best performance in classifying the Leaf Spot class, with 
precision, recall, and  mAP@0.5 values of 0.86. The Healthy class also showed good classification capability with a 
score of 0.71. Meanwhile, the Leaf Curl class obtained moderate performance with a value of 0.55. The Yellow Leaf 
class produced the lowest result, with a score of  0.38, indicating that the model still experienced difficulty 
distinguishing this class from other disease categories due to similarities in color and texture characteristics. 
To further analyze the classification performance and identify patterns of miscl assification among classes, the 
normalized confusion matrix is presented in Figure 4. 


--- page 6 ---
 
 
E-ISSN : 2807-9035 
Volume 6, Number 3, August 2026 
https://doi.org/10.47709/brilliance.v6i3.8627 
  
 
 
This is an Creative Commons License This work is licensed under a Creative 
Commons Attribution-NonCommercial 4.0 International License.  
 
436 
 
Figure  4. Normalized Confusion Matrix of CNN Model 
 
Confusion Matrix Analysis 
The confusion matrix results indicate that the model performs very well in classifying the leaf spot class, 
achieving the highest accuracy of approximately 0.86. The healthy leaf class also shows good performance with an 
accuracy of around 0.71. Meanwhile, the leaf curl class demonstrates moderate performance with an  accuracy of 
approximately 0.55. The yellow leaf class shows relatively low performance, with an accuracy of around 0.38, 
indicating difficulty in distinguishing this class from others. Some misclassification occurs between the leaf curl and 
yellow leaf classes, suggesting that these classes share similar visual characteristics such as color and texture patterns. 
 
DISCUSSION 
The findings of this study indicate that the proposed Convolutional Neural Network (CNN) model is capable of 
performing multi-class classification of chili leaf diseases with satisfactory results. Based on the evaluation, the model 
achieves a precision of 0.75, recall of 0.53, and mAP@0.5 of 0.60, suggesting that it can correctly classify a 
considerable portion of the dataset, although improvements are still needed, particularly in recall performance. 
During training, the model shows stable learning behavior, reflected by the continuous reduction in loss values 
and gradual improvement in evaluation metrics such as precision and mAP. This trend indicates that the model is able 
to capture relevant patterns from the dataset effectively without experiencing significant overfitting. In addition, the 
application of preprocessing and data augmentation contributes to improving the model’s ability to generalize under 
different conditions. 
The confusion matrix analysis further reveals that the model performs best in identifying the leaf spot class, 
achieving the highest level of accuracy. This performance is likely influenced by the distinctive visua l characteristics of 
leaf spot, such as clear and consistent patterns that are easier for the model to recognize. The healthy class also 
demonstrates strong performance, indicating that the model can effectively differentiate between normal and diseased 
leaves. 
On the other hand, the classification performance for the leaf curl and yellow leaf classes is relatively lower. The 
leaf curl class shows moderate accuracy, while the yellow leaf class has the lowest performance among all categories. 
This limitation can be explained by the similarity in visual features between these classes, including overlapping color 
patterns and subtle texture differences. As a result, the model encounters difficulties in distinguishing between them, 
leading to several misclassification cases. 
The results obtained in this study can be compared with previous CNN -based plant disease classification studies. 
Rizki Ridhwan and Hudori (2026) reported promising performance in detecting yellow leaf virus disease in chili plants 
using a CNN -based approach. Similarly, Suhardin et al. (2021) demonstrated that CNN models can achieve high 
classification performance when trained using datasets with relatively uniform image characteristics and controlled 
environmental conditions. Compared with the se studies, the performance achieved in this research is relatively lower. 
However, this difference can be attributed to the use of images collected directly from field conditions, which contain 
variations in lighting, background complexity, leaf orientati on, and disease symptoms. These factors increase the 
difficulty of classification while providing a more realistic evaluation scenario. Therefore, although the performance 


--- page 7 ---
 
 
E-ISSN : 2807-9035 
Volume 6, Number 3, August 2026 
https://doi.org/10.47709/brilliance.v6i3.8627 
  
 
 
This is an Creative Commons License This work is licensed under a Creative 
Commons Attribution-NonCommercial 4.0 International License.  
 
437 
metrics are lower than those reported in some previous studies, the proposed model d emonstrates stronger applicability 
for practical deployment in real agricultural environments. 
Overall, this study demonstrates that CNN -based approaches have strong potential for supporting early detection 
of chili leaf diseases. However, further refineme nt is necessary to improve accuracy and ensure better performance 
under real-world conditions. 
 
CONCLUSION 
This study presents the development of a CNN -based system for early detection of chili leaf diseases, with 
evaluation results showing a precision of 0.75, recall of 0.53, and mAP@0.5 of 0.60. These findings suggest that the 
model is able to perform classification tasks with acceptable performance. The implementation of CNN highlights its 
potential as a reliable approach for automated disease detection in agricultural applications. 
Despite these results, several limitations remain, particularly in distinguishing classes with similar visual 
characteristics. Therefore, further improvements are necessary, including expanding the dataset and refining the model 
to enhance overall accuracy and performance. 
 
ACKNOWLEDGMENT 
The authors gratefully acknowledge the support of the Informatics Engineering Study Program, Faculty of 
Engineering, Universitas Malikussaleh. Special thanks are extended to the supervisors  for their invaluable guidance, 
constructive feedback, and continuous support throughout the research process. The authors also appreciate all 
individuals and institutions that contributed directly or indirectly to the completion of this work. 
 
REFERENCES 
 
Dengan Operator, J., & Dan, S. (n.d.). STUDI PEMBANDING DETEKSI TEPI (EDGE DETECTION) CITRA. 
Diana, R., Warni, H., & Sutabri, T. (2023). PENGGUNAAN TEKNOLOGI MACHINE LEARNING UNTUK 
PELAYANAN MONITORING KEGIA TAN BELAJAR MENGAJAR PADA SMK BINA SRIWIJAYA 
PALEMBANG. JUTEKIN (Jurnal Teknik Informatika), 11(1). https://doi.org/10.51530/jutekin.v11i1.709 
Fahd, K., & Miah, S. J. (2023). Effectiveness of data augmentation to predict students at risk using deep learning 
algorithms. Social Network Analysis and Mining  2023 13:1 , 13(1), 113 -. https://doi.org/10.1007/S13278 -023-
01117-5 
Fergus, P., & Chalmers, C. (2022). Performance Evaluation Metrics . 115 –138. https://doi.org/10.1007/978 -3-031-
04420-5_5 
G Hermawan. (2024). Memahami Peran Dataset dalam Penelitian Kecerdas an Buatan: Kualitas, Aksesibilitas, dan 
Tantangan. Researchgate.NetG HermawanPreprint, Oct, 2024•researchgate.Net . 
https://www.researchgate.net/profile/Galih-
Hermawan/publication/384863552_Memahami_Peran_Dataset_dalam_Penelitian_Kecerdasan_Buatan_Kualitas_
Aksesibilitas_dan_Tantangan/links/670a921affe5b72812455d04/Memahami-Peran-Dataset-dalam-Penelitian-
Kecerdasan-Buatan-Kualitas-Aksesibilitas-dan-Tantangan.pdf 
Gita Fakhira, A., Mindrati Fardhani, D., & Afifah Nugraheni, I. (n.d.). Serangan Yellow Leaf Curl Virus (YLCV) pada 
tanaman cabai (Capsicum spp.) di Daerah Nogotirto (V ol. 3). 
Gunawan, R. J., Irawan, B., & Setianingsih, C. (2021). Pengenalan Ekspresi Wajah Berbasis Convolutional Neural 
Network Dengan Model Arsitektur Vgg16 . 
Https://Openlibrarypublications.Telkomuniversity.Ac.Id/Index.Php/Engineering/Article/View/16400. 
Hanum, M., & Artikel, S. (2024). Implementasi Teknik Embossing pada Pengenalan Plat Kendaraan untuk Identifikasi 
Otomatis Berbasis OpenCV . JoMMiT : Jurnal Multi Media Dan IT , 8(1), 062–068. 
https://doi.org/10.46961/JOMMIT.V8I1.1361 
Homepage, J., Devianto, Y ., Dwiasnati, S., Sukowo, B., Fauzi, A., & Baihaqi, K. A. (2023). Penerapan Technique for 
Order Performance by Similarity to Ideal Solution (TOPSIS) untuk Mendiagnosa Penyakit Berc ak Daun Cabai. 
MALCOM: Indonesian Journal of Machine Learning and Computer Science , 3(2), 136 –142. 
https://doi.org/10.57152/MALCOM.V3I2.850 
Iman, M., Arabnia, H. R., & Rasheed, K. (2023). A Review of Deep Transfer Learning and Recent Advancements. 
Technologies 2023, V ol. 11, Page 40, 11(2), 40. https://doi.org/10.3390/TECHNOLOGIES11020040 
Inaya, N., Meriem, S., & Masriany, M. (2022). Identifikasi morfologi penyakit tanaman cabai (Capsicum sp.) yang 
disebabkan oleh patogen dan serangan hama lingkup kampus UI N Alauddin Makassar. Filogeni: Jurnal 
Mahasiswa Biologi, 2, 8–14. https://doi.org/10.24252/filogeni.v2i1.27092 
Khan, A., Rauf, Z., Sohail, A., Khan, A. R., Asif, H., Asif, A., & Farooq, U. (2023). A survey of the vision transformers 
and their CNN -transformer based variants. Artificial Intelligence Review 2023 56:3 , 56(3), 2917 –2970. 
https://doi.org/10.1007/S10462-023-10595-0 
Kulkarni, P., Karwande, A., Kolhe, T., Kamble, S., Joshi, A., & Wyawahare, M. (2021). Plant Disease Detection Using 

--- page 8 ---
 
 
E-ISSN : 2807-9035 
Volume 6, Number 3, August 2026 
https://doi.org/10.47709/brilliance.v6i3.8627 
  
 
 
This is an Creative Commons License This work is licensed under a Creative 
Commons Attribution-NonCommercial 4.0 International License.  
 
438 
Image Processing and Machine Learning. Lecture Notes in Electrical Engineering , 936, 549 –561. 
https://doi.org/10.1007/978-981-19-5037-7_39 
Mienye, I. D., & Swart, T. G. (2024). A Comprehensive Review of Deep Learning: Architectures, Recent Advances, and 
Applications. Information 2024, V ol. 15, Page 755, 15(12), 755. https://doi.org/10.3390/INFO15120755 
Minaee, S., Boykov, Y ., Porikli, F., Plaza, A., Kehtarnavaz, N., & Terzopoulos, D. (2022). Image Segmentation Using 
Deep Learning: A Survey. IEEE Transactions on Pattern Analysis and Machine Intelligence , 44(7), 3523–3542. 
https://doi.org/10.1109/TPAMI.2021.3059968 
Muthulakshmi, K., & Jayalakshmi, M. (2025). Rethinking model of EfficientNet -B9 for brain tumor classification: A 
high-precision deep learning appr oach. Results in Engineering , 28, 107984. 
https://doi.org/10.1016/J.RINENG.2025.107984 
Nyaga, C., Gowda, M., Beyene, Y ., Murithi, W . T., Burgueno, J., Toledo, F., Makumbi, D., Olsen, M. S., Das, B., 
Suresh, L. M., Bright, J. M., & Prasanna, B. M. (2020). H ybrid Breeding for MLN Resistance: Heterosis, 
Combining Ability, and Hybrid Prediction. Plants 2020, V ol. 9, Page 468 , 9(4), 468. 
https://doi.org/10.3390/PLANTS9040468 
Raup, A., Ridwan, W ., Khoeriyah, Y ., Supiana, S., & Zaqiah, Q. Y . (2022). Deep Learning dan Penerapannya dalam 
Pembelajaran. JIIP - Jurnal Ilmiah Ilmu Pendidikan, 5(9), 3258–3267. https://doi.org/10.54371/JIIP.V5I9.805 
Riehl, K., Neunteufel, M., & Hemberg, M. (2023). Hierarchical confusion matrix for classification performance 
evaluation. Journal of the Royal Statistical Society Series C: Applied Statistics , 72(5), 1394 –1412. 
https://doi.org/10.1093/JRSSSC/QLAD057 
Rizki Ridhwan, M., & Hudori, H. (2026). Identifikasi Penyakit Virus Kuning pada Tanaman Cabai  dengan Pendekatan 
CNN. Jurnal SAINTEK OM (Sains Dan Teknologi Komputasi) , 2(1), 66 –78. 
https://doi.org/10.36350/jskom.v2i1.81 
Suhardin, I., Patombongi, A., & Islah, A. M. (2021). MENGIDENTIFIKASI JENIS TANAMAN BERDASARKAN 
CITRA DAUN MENGGUNAKAN AlGORITMA CONVOLUTIONAL NEURAL NETWORK. Simtek : Jurnal 
Sistem Informasi Dan Teknik Komputer, 6, 100–108. https://doi.org/10.51876/simtek.v6i2.101 
Suyanto, A., Masulili, A., Ekawati, E., Setiawan, S., Astar, I., & Ayen, R. Y . (2023). Budidaya Cabe Rawit Tanpa 
Terserang Penyakit Keriting Daun di Kelompok Tani Horti Maju Desa Punggur Kecil, Kec. Sungai Kakap, Kab. 
Kubu Raya. Jurnal Abdi Masyarakat Indonesia, 3, 1271–1276. https://doi.org/10.54082/jamsi.857 
Ucan, M., Kaya, B., & Kaya, M. (2022). Multi -Class Gastrointestinal Images Classification Using Effici entNet-B0 
CNN Model. 2022 International Conference on Data Analytics for Business and Industry, ICDABI 2022 , 146–
150. https://doi.org/10.1109/ICDABI56818.2022.10041447 
Wali, K. L., Amanupunnyo, H. R., & Tuhumury, G. N. C. (2025). Kajian Keberadaan Jenis -Jenis Penyakit -penyakit 
Tanaman Penting pada Cabai (Capsicum sp.). JURNAL PERTANIAN KEPULAUAN , 9, 42 –49. 
https://doi.org/10.30598/jpk.2025.9.1.42 
Zeng, W ., & Zeng, W . (2024). Image data augmentation techniques based on deep learning: A survey. Mathematical 
Biosciences and Engineering 2024 6:6190, 21(6), 6190–6224. https://doi.org/10.3934/MBE.2024272 
  