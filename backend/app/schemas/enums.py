from enum import Enum

class TaskStatus(Enum):
    OPEN = "open"
    ASSIGNED_TO_FL = "assigned_to_fl"
    UNDER_REVIEW = "under_review"
    COMPLETE = "complete"

class JobStatus(str, Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CLOSED = "closed"

class IssueType(Enum):
    WRONG_SOURCE_LANGUAGE = "wrong_source_language"
    PAYMENT_DELAY = "payment_delay"
    ACCURACY_APPEAL = "accuracy_appeal"
    OTHER = "other"

class ReportStatus(Enum):
    UNDER_REVIEW = "under_review"
    PROCEED = "proceed"

class PaymentMethod(Enum):
    PAYPAL = "PayPal"
    PAYONEER = "Payoneer"
    KPAY = "Kpay"
    WAVEPAY = "Wavepay"

class WithdrawalStatus(Enum):
    UNDER_PROCESSING = "under_processing"
    PROCESSED = "processed"