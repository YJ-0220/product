import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getWorkProgress, getWorkItemByOrderId, getOrderApplicationsByOrder } from "@/api/order";
import type { WorkProgressData } from "@/types/orderTypes";
import { useUtils } from "@/hooks/useUtils";

export default function WorkProgressView() {
  const { id: orderId } = useParams<{ id: string }>();
  const { getStatusText, getStatusColor } = useUtils();
  const [workProgresses, setWorkProgresses] = useState<WorkProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchWorkProgress = async () => {
      if (!orderId) return;
      
      try {
        setLoading(true);
        
        // 승인된 신청서 조회
        const applicationsData = await getOrderApplicationsByOrder(orderId, "accepted");
        
        if (applicationsData.applications && applicationsData.applications.length > 0) {
          const applicationId = applicationsData.applications[0].id;
          
          // WorkItem 조회
          const workItemData = await getWorkItemByOrderId(orderId, applicationId);
          if (workItemData.workItem) {
            // 작업 진행 상황 조회
            const progressData = await getWorkProgress(orderId, applicationId);
            setWorkProgresses(progressData.workProgresses || []);
          } else {
            setError("작업물을 찾을 수 없습니다.");
          }
        } else {
          setError("승인된 신청서를 찾을 수 없습니다.");
        }
      } catch (error: any) {
        setError("작업 진행 상황을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkProgress();
  }, [orderId]);



  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <p className="text-gray-600">작업 진행 상황을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (workProgresses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-6">작업 진행 상황</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">아직 작업 진행 상황이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">판매자가 작업을 시작하면 여기에 진행 상황이 표시됩니다.</p>
        </div>
      </div>
    );
  }

  // 전체 진행률 계산
  const latestProgress = workProgresses[0]; // 가장 최근 진행 상황
  const totalProgress = latestProgress?.progressPercent || 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6">작업 진행 상황</h2>
      
      {/* 전체 진행률 */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">전체 진행률</h3>
          <span className="text-2xl font-bold text-blue-600">{totalProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          마지막 업데이트: {latestProgress ? new Date(latestProgress.updatedAt).toLocaleString('ko-KR') : '없음'}
        </p>
      </div>

      {/* 진행 상황 히스토리 */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">진행 상황 상세</h3>
        {workProgresses.map((progress, index) => (
          <div key={progress.id} className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900 mb-2">{progress.title}</h4>
                {progress.description && (
                  <p className="text-gray-600 mb-3">{progress.description}</p>
                )}
              </div>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(progress.status)}`}>
                {getStatusText(progress.status)}
              </span>
            </div>
            
            {/* 개별 진행률 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">이 단계 진행률</span>
                <span className="text-sm font-bold text-gray-900">{progress.progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress.progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* 작업 과정 이미지들 */}
            {progress.imageUrls && progress.imageUrls.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">작업 과정</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {progress.imageUrls.map((imageUrl, imgIndex) => (
                    <div key={imgIndex} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={`작업 과정 ${imgIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-400">
                {new Date(progress.createdAt).toLocaleString('ko-KR')}
              </span>
              {index === 0 && (
                <span className="text-xs text-blue-600 font-medium">최신 업데이트</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 작업 완료 예상일 */}
      {workProgresses.length > 0 && (
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">작업 완료 예상일</h4>
          <p className="text-sm text-yellow-700">
            판매자가 설정한 예상 완료일을 확인하려면 주문 상세 페이지를 확인해주세요.
          </p>
        </div>
      )}
    </div>
  );
} 