import axios from "axios";

async function rednote(url) {  
    try {  
        const response = await axios.get(url);  
        const html = response.data;  
  
        // Extract title  
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);  
        const title = titleMatch ? titleMatch[1].trim() : '';  
  
        // Extract meta tags  
        const descriptionMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/i);  
        const description = descriptionMatch ? descriptionMatch[1].trim() : '';  
  
        const keywordsMatch = html.match(/<meta\s+name="keywords"\s+content="(.*?)"/i);  
        const keywords = keywordsMatch ? keywordsMatch[1].trim() : '';  
  
        const videoUrlMatch = html.match(/<meta\s+name="og:video"\s+content="(.*?)"/i);  
        const videoUrl = videoUrlMatch ? videoUrlMatch[1].trim() : '';  
  
        const ogUrlMatch = html.match(/<meta\s+name="og:url"\s+content="(.*?)"/i);  
        const noteId = ogUrlMatch ? ogUrlMatch[1].trim().split('/').pop() : '';  
  
        const durationMatch = html.match(/<meta\s+name="og:videotime"\s+content="(.*?)"/i);  
        const duration = durationMatch ? durationMatch[1].trim() : '';  
  
        const ogTitleMatch = html.match(/<meta\s+name="og:title"\s+content="(.*?)"/i);  
        const nickname = ogTitleMatch ? ogTitleMatch[1].trim().split(' - ')[0] : '';  
  
        // Extract images  
        const images = [];  
        const imageMatches = html.match(/<meta\s+name="og:image"\s+content="(.*?)"/gi);  
        if (imageMatches) {  
            imageMatches.forEach(match => {  
                const imageMatch = match.match(/content="(.*?)"/i);  
                if (imageMatch) {  
                    images.push(imageMatch[1].trim());  
                }  
            });  
        }  
  
        // Extract note comments, likes, and collects  
        const noteCommentsMatch = html.match(/<meta\s+name="og:xhs:note_comment"\s+content="(.*?)"/i);  
        const noteComments = noteCommentsMatch ? noteCommentsMatch[1].trim() : '';  
  
        const noteLikesMatch = html.match(/<meta\s+name="og:xhs:note_like"\s+content="(.*?)"/i);  
        const noteLikes = noteLikesMatch ? noteLikesMatch[1].trim() : '';  
  
        const noteCollectsMatch = html.match(/<meta\s+name="og:xhs:note_collect"\s+content="(.*?)"/i);  
        const noteCollects = noteCollectsMatch ? noteCollectsMatch[1].trim() : '';  
  
        // Extract comments  
        const comments = [];  
        const commentMatches = html.match(/<div\s+class="parent-comment">(.*?)<\/div>/gi);  
        if (commentMatches) {  
            commentMatches.forEach(commentMatch => {  
                const commentAuthorMatch = commentMatch.match(/<a\s+class="author">(.*?)<\/a>/i);  
                const commentContentMatch = commentMatch.match(/<div\s+class="note-text">(.*?)<\/div>/i);  
                const commentTimeMatch = commentMatch.match(/<span\s+class="date">(.*?)<\/span>/i);  
                const commentLocationMatch = commentMatch.match(/<span\s+class="location">(.*?)<\/span>/i);  
  
                const author = commentAuthorMatch ? commentAuthorMatch[1].trim() : '';  
                const content = commentContentMatch ? commentContentMatch[1].trim() : '';  
                const time = commentTimeMatch ? commentTimeMatch[1].trim() : '';  
                const location = commentLocationMatch ? commentLocationMatch[1].trim() : '';  
  
                comments.push({  
                    author,  
                    content,  
                    time,  
                    location,  
                });  
            });  
        }  
  
        const result = {  
            noteId,  
            nickname,  
            title,  
            description,  
            keywords,  
            duration,  
            noteLikes,  
            noteCollects,  
            noteComments,  
            images,  
            videoUrl,  
        };  
  
        return result;  
    } catch (error) {  
        console.error("Error fetching data:", error.message);  
        throw error;  
    }  
} 

export default rednote;